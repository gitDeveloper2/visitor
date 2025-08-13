import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { AppPremiumListing } from '@/models/PremiumAccess';
import { lemonSqueezyClient } from '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    const { orderId, appId } = await request.json();
    
    if (!orderId || !appId) {
      return NextResponse.json({ message: 'Order ID and App ID are required' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Verify the order exists and belongs to the user
    try {
      const order = await lemonSqueezyClient.retrieveOrder({ id: orderId });
      
      if (!order.data) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      
      // Check if order is for premium app listing
      if (order.data.attributes.product_id.toString() !== process.env.LEMON_SQUEEZY_PREMIUM_APP_PRODUCT_ID) {
        return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
      }
      
      // Check if order email matches user email
      if (order.data.attributes.customer_email !== session.user.email) {
        return NextResponse.json({ message: 'Order does not belong to user' }, { status: 403 });
      }
      
      // Check if order is paid
      if (order.data.attributes.status !== 'paid') {
        return NextResponse.json({ message: 'Order not yet paid' }, { status: 400 });
      }
      
    } catch (error) {
      console.error('Error verifying order:', error);
      return NextResponse.json({ message: 'Error verifying order' }, { status: 500 });
    }
    
    // Check if app exists and belongs to user
    const app = await db.collection('userapps').findOne({ 
      _id: appId, 
      author: session.user.id 
    });
    
    if (!app) {
      return NextResponse.json({ message: 'App not found or does not belong to user' }, { status: 404 });
    }
    
    // Check if app already has premium listing
    const existingPremium = await AppPremiumListing.findOne({ appId });
    if (existingPremium && existingPremium.status === 'active') {
      return NextResponse.json({ message: 'App already has premium listing' }, { status: 400 });
    }
    
    // Create premium listing record
    const premiumListing = await AppPremiumListing.create({
      userId: session.user.id,
      appId,
      orderId,
      status: 'active',
      // Premium app listings don't expire
    });
    
    // 🛡️ SECURITY FIX: Do NOT set premium status here
    // Premium status should ONLY be set by webhook verification
    // This prevents direct premium activation bypassing security
    
    // Instead, mark the app as ready for premium activation
    await db.collection('userapps').updateOne(
      { _id: appId },
      { 
        $set: { 
          premiumOrderId: orderId,
          premiumReadyForActivation: true, // 🛡️ Mark as ready, not active
          premiumReadyAt: new Date(),
          premiumStatus: 'pending_webhook', // 🛡️ Status pending webhook verification
          // 🛡️ isPremium remains false until webhook verification
        } 
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Premium listing created successfully. Premium status will be activated after webhook verification.',
      premiumListing,
      // 🛡️ Clear messaging about security
      note: 'Premium status activation requires webhook verification for security'
    });
    
  } catch (error) {
    console.error('Error connecting order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 