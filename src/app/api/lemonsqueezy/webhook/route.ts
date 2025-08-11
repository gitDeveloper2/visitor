// app/api/webhook/route.ts

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { handleLemonWebhook } from '../service/lemonSqueezy';

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook called');

  try {
    const payload = await request.text();

    // Verify signature
    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('❌ Missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('❌ Missing LEMON_SQUEEZY_WEBHOOK_SECRET env variable');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (
      signatureBuffer.length !== digest.length ||
      !crypto.timingSafeEqual(signatureBuffer, digest)
    ) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse and validate payload
    const parsed = JSON.parse(payload);
    const { meta, data: eventData } = parsed;

    if (!meta?.event_name || !eventData) {
      console.error('❌ Invalid webhook data structure');
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    // Dispatch to handler
    await handleLemonWebhook({ event_name: meta.event_name, data: eventData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔥 Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
