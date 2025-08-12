// services/webhookLogger.ts

import type { Db } from 'mongodb';

export interface WebhookLogEntry {
  id: string;
  eventName: string;
  userId: string;
  resourceId?: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  startedAt: Date;
  completedAt?: Date;
  processingTime?: number;
  error?: string;
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookLogResult {
  success: boolean;
  logId: string;
  message: string;
  error?: string;
}

// ===== WEBHOOK LOGGING SERVICE =====

export class WebhookLogger {
  private db: Db;
  private collection = 'webhook_logs';

  constructor(db: Db) {
    this.db = db;
  }

  // ===== CREATE LOG ENTRY =====

  async createLogEntry(
    eventName: string,
    userId: string,
    resourceId: string | undefined,
    payload: any
  ): Promise<string> {
    const logEntry: WebhookLogEntry = {
      id: this.generateLogId(),
      eventName,
      userId,
      resourceId,
      payload: this.sanitizePayload(payload),
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.collection(this.collection).insertOne(logEntry);
    return logEntry.id;
  }

  // ===== UPDATE LOG STATUS =====

  async updateLogStatus(
    logId: string,
    status: WebhookLogEntry['status'],
    result?: any,
    error?: string
  ): Promise<void> {
    const update: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'processing') {
      update.attempts = { $inc: 1 };
    } else if (status === 'completed' || status === 'failed') {
      update.completedAt = new Date();
      update.processingTime = Date.now() - new Date().getTime();
      
      if (result) {
        update.result = result;
      }
      
      if (error) {
        update.error = error;
      }
    }

    await this.db.collection(this.collection).updateOne(
      { id: logId },
      { $set: update }
    );
  }

  // ===== MARK AS PROCESSING =====

  async markAsProcessing(logId: string): Promise<void> {
    await this.updateLogStatus(logId, 'processing');
  }

  // ===== MARK AS COMPLETED =====

  async markAsCompleted(logId: string, result: any): Promise<void> {
    await this.updateLogStatus(logId, 'completed', result);
  }

  // ===== MARK AS FAILED =====

  async markAsFailed(logId: string, error: string): Promise<void> {
    await this.updateLogStatus(logId, 'failed', undefined, error);
  }

  // ===== RETRY FAILED WEBHOOKS =====

  async getFailedWebhooks(): Promise<WebhookLogEntry[]> {
    return await this.db.collection(this.collection)
      .find({
        status: 'failed',
        attempts: { $lt: 3 }
      })
      .sort({ createdAt: 1 })
      .limit(10)
      .toArray();
  }

  // ===== GET WEBHOOK STATISTICS =====

  async getWebhookStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
    processing: number;
    averageProcessingTime: number;
  }> {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
          totalProcessingTime: { $sum: { $ifNull: ['$processingTime', 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          successful: 1,
          failed: 1,
          pending: 1,
          processing: 1,
          averageProcessingTime: {
            $cond: [
              { $gt: ['$completedCount', 0] },
              { $divide: ['$totalProcessingTime', '$completedCount'] },
              0
            ]
          }
        }
      }
    ];

    const result = await this.db.collection(this.collection).aggregate(pipeline).toArray();
    return result[0] || {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      processing: 0,
      averageProcessingTime: 0
    };
  }

  // ===== CLEANUP OLD LOGS =====

  async cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.db.collection(this.collection).deleteMany({
      createdAt: { $lt: cutoffDate },
      status: { $in: ['completed', 'failed'] }
    });

    return result.deletedCount || 0;
  }

  // ===== UTILITY METHODS =====

  private generateLogId(): string {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizePayload(payload: any): any {
    // Remove sensitive information from payload
    const sanitized = { ...payload };
    
    if (sanitized.data?.attributes) {
      // Remove sensitive payment information
      delete sanitized.data.attributes.card_brand;
      delete sanitized.data.attributes.card_last_four;
      delete sanitized.data.attributes.customer_email;
      delete sanitized.data.attributes.customer_name;
    }

    return sanitized;
  }

  // ===== GET LOG BY ID =====

  async getLogById(logId: string): Promise<WebhookLogEntry | null> {
    return await this.db.collection(this.collection).findOne({ id: logId });
  }

  // ===== GET LOGS BY USER =====

  async getLogsByUser(userId: string, limit: number = 50): Promise<WebhookLogEntry[]> {
    return await this.db.collection(this.collection)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // ===== GET LOGS BY EVENT =====

  async getLogsByEvent(eventName: string, limit: number = 50): Promise<WebhookLogEntry[]> {
    return await this.db.collection(this.collection)
      .find({ eventName })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}

// ===== FACTORY FUNCTION =====

export function createWebhookLogger(db: Db): WebhookLogger {
  return new WebhookLogger(db);
} 