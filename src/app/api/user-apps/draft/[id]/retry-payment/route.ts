import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { variantId } = await request.json();
    if (!variantId) {
      return NextResponse.json({ message: 'Variant ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const draftId = params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(draftId)) {
      return NextResponse.json({ message: 'Invalid draft ID format' }, { status: 400 });
    }

    // Verify the draft exists and belongs to the user
    const draft = await db.collection('app_drafts').findOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (!draft) {
      return NextResponse.json({ message: 'App draft not found' }, { status: 404 });
    }

    // Create checkout session directly with Lemon Squeezy
    console.log('🔗 Creating Lemon Squeezy checkout directly');
    
    const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
    const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
      console.error('Missing LEMON_SQUEEZY_API_KEY or LEMON_SQUEEZY_STORE_ID env variables');
      return NextResponse.json(
        { message: 'Server misconfiguration: Missing env variables' },
        { status: 500 }
      );
    }

    // Build custom payload
    const customPayload: Record<string, string> = {
      user_id: session.user.id,
      subscription_type: "premium_app",
      draft_id: draftId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/submission/app?draftId=${draftId}&payment_success=true`,
    };

    // Add success_url inside custom
    customPayload.success_url = customPayload.return_url;

    const body = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: customPayload,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: LEMON_SQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    };

    console.log('📤 Outgoing Lemon Squeezy payload:', JSON.stringify(body));

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('📡 Response from Lemon Squeezy:', data);

    if (!res.ok) {
      console.error('❌ Lemon Squeezy API responded with error:', data);
      return NextResponse.json(
        { message: `Failed to create checkout: ${data?.errors || 'Unknown error'}` },
        { status: res.status }
      );
    }

    console.log('✅ Checkout created successfully');
    
    if (data.data?.attributes?.url) {
      return NextResponse.json({ checkoutUrl: data.data.attributes.url });
    } else {
      throw new Error('Checkout URL not found in Lemon Squeezy response');
    }
  } catch (error) {
    console.error('Error creating retry payment checkout:', error);
    return NextResponse.json(
      { message: 'Failed to create retry payment checkout.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
} 