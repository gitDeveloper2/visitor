// app/api/webhook/route.ts

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { handleLemonWebhook } from '../service/lemonSqueezy';

// ===== WEBHOOK LOGGING =====

const webhookLogger = {
  info: (message: string, data?: any) => console.log(JSON.stringify({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    data
  })),
  error: (message: string, error?: any) => console.error(JSON.stringify({
    level: 'error',
    message,
    timestamp: new Date().toISOString(),
    error: error?.message || error,
    stack: error?.stack
  })),
  warn: (message: string, data?: any) => console.warn(JSON.stringify({
    level: 'warn',
    message,
    timestamp: new Date().toISOString(),
    data
  }))
};

// ===== SIGNATURE VERIFICATION =====

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (signatureBuffer.length !== digest.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, digest);
  } catch (error) {
    webhookLogger.error('Signature verification error', error);
    return false;
  }
}

// ===== PAYLOAD VALIDATION =====

function validateWebhookPayload(parsed: any): { isValid: boolean; error?: string; data?: any } {
  try {
    const { meta, data: eventData } = parsed;

    if (!meta?.event_name) {
      return { isValid: false, error: 'Missing event_name in meta' };
    }

    if (!eventData) {
      return { isValid: false, error: 'Missing data in webhook payload' };
    }

    if (!eventData.attributes) {
      return { isValid: false, error: 'Missing attributes in event data' };
    }

    return { isValid: true, data: { meta, eventData } };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON payload structure' };
  }
}

// ===== MAIN WEBHOOK HANDLER =====

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  webhookLogger.info('🔔 Webhook called');

  try {
    // Get raw payload
    const payload = await request.text();
    
    // Verify signature
    const signature = request.headers.get('x-signature');
    if (!signature) {
      webhookLogger.error('❌ Missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      webhookLogger.error('❌ Missing LEMON_SQUEEZY_WEBHOOK_SECRET env variable');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, secret)) {
      webhookLogger.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse and validate payload
    let parsed;
    try {
      parsed = JSON.parse(payload);
    } catch (error) {
      webhookLogger.error('❌ Invalid JSON payload', error);
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Validate webhook structure
    const validation = validateWebhookPayload(parsed);
    if (!validation.isValid) {
      webhookLogger.error('❌ Invalid webhook data structure', { error: validation.error });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { meta, eventData } = validation.data!;
    webhookLogger.info('Webhook payload validated', { 
      event: meta.event_name,
      hasCustomData: !!meta.custom_data,
      customDataKeys: meta.custom_data ? Object.keys(meta.custom_data) : []
    });

    // Extract user ID and resource ID from custom data
    const customData = meta?.custom_data || {};
    const userId = customData.user_id;
    const resourceId = customData.draft_id || customData.app_id;

    // Validate required fields
    if (!userId) {
      webhookLogger.error('❌ Missing user_id in custom data', { customData });
      return NextResponse.json({ error: 'Missing user_id in custom data' }, { status: 400 });
    }

    // Log webhook processing
    webhookLogger.info('Processing webhook', {
      event: meta.event_name,
      userId,
      resourceId,
      hasEventData: !!eventData
    });

    // Dispatch to handler
    const result = await handleLemonWebhook({
      event_name: meta.event_name,
      data: eventData,
      userId: userId,
      resourceid: resourceId
    });

    const processingTime = Date.now() - startTime;
    
    if (result.success) {
      webhookLogger.info('✅ Webhook processed successfully', {
        event: meta.event_name,
        userId,
        resourceId,
        processingTime,
        message: result.message
      });
    } else {
      webhookLogger.warn('⚠️ Webhook processed with warnings', {
        event: meta.event_name,
        userId,
        resourceId,
        processingTime,
        message: result.message,
        error: result.error
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: result.message,
      processingTime 
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    webhookLogger.error('🔥 Webhook error', {
      error,
      processingTime,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({ 
      error: 'Internal server error',
      processingTime 
    }, { status: 500 });
  }
}

// ===== HEALTH CHECK ENDPOINT =====

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    message: 'Lemon Squeezy webhook endpoint is running',
    timestamp: new Date().toISOString()
  });
}
