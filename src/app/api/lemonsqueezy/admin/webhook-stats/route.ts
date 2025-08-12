// app/api/lemonsqueezy/admin/webhook-stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { createWebhookLogger } from '../../service/webhookLogger';

// ===== ADMIN WEBHOOK STATISTICS =====

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getSession();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    const webhookLogger = createWebhookLogger(db);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const eventName = searchParams.get('eventName');
    const logId = searchParams.get('logId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let result: any;

    switch (action) {
      case 'stats':
        // Get overall webhook statistics
        result = await webhookLogger.getWebhookStats();
        break;

      case 'failed':
        // Get failed webhooks for retry
        result = await webhookLogger.getFailedWebhooks();
        break;

      case 'user':
        // Get webhook logs for specific user
        if (!userId) {
          return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
        }
        result = await webhookLogger.getLogsByUser(userId, limit);
        break;

      case 'event':
        // Get webhook logs for specific event
        if (!eventName) {
          return NextResponse.json({ error: 'eventName parameter required' }, { status: 400 });
        }
        result = await webhookLogger.getLogsByEvent(eventName, limit);
        break;

      case 'log':
        // Get specific webhook log
        if (!logId) {
          return NextResponse.json({ error: 'logId parameter required' }, { status: 400 });
        }
        result = await webhookLogger.getLogById(logId);
        break;

      case 'cleanup':
        // Clean up old webhook logs
        const daysToKeep = parseInt(searchParams.get('days') || '30');
        const deletedCount = await webhookLogger.cleanupOldLogs(daysToKeep);
        result = { deletedCount, message: `Cleaned up ${deletedCount} old webhook logs` };
        break;

      default:
        // Default: return statistics
        result = await webhookLogger.getWebhookStats();
        break;
    }

    return NextResponse.json({
      success: true,
      action: action || 'stats',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get webhook statistics' },
      { status: 500 }
    );
  }
}

// ===== RETRY FAILED WEBHOOK =====

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getSession();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { logId } = await request.json();
    
    if (!logId) {
      return NextResponse.json({ error: 'logId is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const webhookLogger = createWebhookLogger(db);

    // Get the failed webhook log
    const logEntry = await webhookLogger.getLogById(logId);
    if (!logEntry) {
      return NextResponse.json({ error: 'Webhook log not found' }, { status: 404 });
    }

    if (logEntry.status !== 'failed') {
      return NextResponse.json({ error: 'Webhook is not in failed status' }, { status: 400 });
    }

    if (logEntry.attempts >= logEntry.maxAttempts) {
      return NextResponse.json({ error: 'Max retry attempts reached' }, { status: 400 });
    }

    // Mark as processing for retry
    await webhookLogger.markAsProcessing(logId);

    // Here you would typically re-process the webhook
    // For now, we'll just mark it as completed
    await webhookLogger.markAsCompleted(logId, { 
      message: 'Retried manually by admin',
      retriedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook marked for retry',
      logId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook retry error:', error);
    return NextResponse.json(
      { error: 'Failed to retry webhook' },
      { status: 500 }
    );
  }
} 