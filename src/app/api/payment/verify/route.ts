import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { lemonSqueezyClient } from '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    const { orderNumber, email } = await request.json();
    
    if (!orderNumber && !email) {
      return NextResponse.json({ 
        message: 'Please provide either an order number or email address' 
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    let orderData = null;
    let orderStatus = null;
    
    // Try to find order by order number first
    if (orderNumber) {
      try {
        // Search in our database first
        const order = await db.collection('premium_blog_orders').findOne({ 
          orderNumber: parseInt(orderNumber) 
        });
        
        if (order) {
          orderData = order;
          orderStatus = order.status;
        } else {
          // If not found in our DB, try Lemon Squeezy API
          const lemonOrder = await lemonSqueezyClient.retrieveOrder({ 
            id: parseInt(orderNumber) 
          });
          
          if (lemonOrder.data) {
            orderData = lemonOrder.data;
            orderStatus = lemonOrder.data.attributes.status;
          }
        }
      } catch (error) {
        console.error('Error fetching order by number:', error);
      }
    }
    
    // If not found by order number, try by email
    if (!orderData && email) {
      try {
        // Search in our database
        const order = await db.collection('premium_blog_orders').findOne({ 
          customerEmail: email.toLowerCase() 
        });
        
        if (order) {
          orderData = order;
          orderStatus = order.status;
        } else {
          // Try Lemon Squeezy API by email (if they have this endpoint)
          // Note: Lemon Squeezy doesn't have a direct email search, so we'll rely on our DB
        }
      } catch (error) {
        console.error('Error fetching order by email:', error);
      }
    }
    
    if (!orderData) {
      return NextResponse.json({ 
        message: 'Order not found. Please check your order number or email address.' 
      }, { status: 404 });
    }
    
    // Verify the order belongs to the current user
    const orderEmail = orderData.customerEmail || orderData.attributes?.customer_email;
    if (orderEmail && orderEmail.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ 
        message: 'This order does not belong to your account.' 
      }, { status: 403 });
    }
    
    // Get additional details
    let subscriptionData = null;
    let premiumAccess = null;
    
    if (orderData.subscriptionId) {
      try {
        const subscription = await lemonSqueezyClient.retrieveSubscription({ 
          id: orderData.subscriptionId 
        });
        subscriptionData = subscription.data;
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    }
    
    // Check premium access status and fix if needed
    let accessFixed = false;
    if (session.user.id) {
      premiumAccess = await db.collection('blog_premium_access').findOne({ 
        userId: session.user.id 
      });
      
      // If payment is valid but user doesn't have access, grant it
      if (orderStatus === 'paid' && (!premiumAccess || !premiumAccess.isActive)) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year from now
        
        const premiumAccessData = {
          userId: session.user.id,
          userEmail: session.user.email,
          isActive: true,
          plan: orderData.productName || 'Premium Blog',
          expiresAt: expiresAt,
          orderNumber: orderData.orderNumber || orderData.id,
          createdAt: now,
          updatedAt: now,
          source: 'payment_verification_fix'
        };
        
        // Upsert premium access
        await db.collection('blog_premium_access').updateOne(
          { userId: session.user.id },
          { $set: premiumAccessData },
          { upsert: true }
        );
        
        // Update user's pro status
        await db.collection('users').updateOne(
          { _id: session.user.id },
          { $set: { pro: true, updatedAt: now } }
        );
        
        // Refresh premium access data
        premiumAccess = premiumAccessData;
        accessFixed = true;
      }
    }
    
    return NextResponse.json({
      success: true,
      accessFixed,
      order: {
        orderNumber: orderData.orderNumber || orderData.id,
        status: orderStatus,
        total: orderData.total || orderData.attributes?.total,
        totalFormatted: orderData.totalFormatted || orderData.attributes?.total_formatted,
        createdAt: orderData.createdAt || orderData.attributes?.created_at,
        productName: orderData.productName || orderData.attributes?.product_name,
        variantName: orderData.variantName || orderData.attributes?.variant_name,
      },
      subscription: subscriptionData ? {
        id: subscriptionData.id,
        status: subscriptionData.attributes.status,
        renewsAt: subscriptionData.attributes.renews_at,
        endsAt: subscriptionData.attributes.ends_at,
      } : null,
      premiumAccess: premiumAccess ? {
        isActive: premiumAccess.isActive,
        expiresAt: premiumAccess.expiresAt,
        plan: premiumAccess.plan,
      } : null,
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      message: 'Error verifying payment. Please try again.' 
    }, { status: 500 });
  }
}
