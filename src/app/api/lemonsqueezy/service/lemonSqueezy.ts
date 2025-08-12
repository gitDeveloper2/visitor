// services/lemonSqueezy.ts

import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@lib/mongodb';
import {
  insertOrder,
  getProductType,
  getPlanType,
  getUserByEmail,
  getUserById,
  getSubscriptionRecord,
  upsertSubscriptionAccess,
  updateSubscriptionStatus,
  updateUserProStatus,
  updateAppPremiumStatus,
} from './db';

// ===== TYPES & INTERFACES =====

export interface LemonEventPayload {
  event_name: string;
  data: any;
  userId: string;  // MongoDB ObjectId - single source of truth
  resourceid?: string;  // Optional resource ID (draft_id, app_id, etc.)
}

export interface WebhookResult {
  success: boolean;
  message: string;
  error?: string;
  processedAt: Date;
}

// ===== LOGGING UTILITY =====

const webhookLogger = {
  info: (event: string, data: any) => console.log(JSON.stringify({
    level: 'info',
    event,
    timestamp: new Date().toISOString(),
    data
  })),
  error: (event: string, error: any) => console.error(JSON.stringify({
    level: 'error',
    event,
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack
  })),
  warn: (event: string, message: string, data?: any) => console.warn(JSON.stringify({
    level: 'warn',
    event,
    timestamp: new Date().toISOString(),
    message,
    data
  }))
};

// ===== MAIN WEBHOOK HANDLER =====

export async function handleLemonWebhook(payload: LemonEventPayload): Promise<WebhookResult> {
  const startTime = Date.now();
  
  try {
    const { db } = await connectToDatabase();
    webhookLogger.info('webhook_started', { event: payload.event_name, userId: payload.userId });

    // Validate payload
    if (!payload.userId || !payload.event_name) {
      throw new Error('Invalid webhook payload: missing userId or event_name');
    }

    // Route to appropriate handler
    const result = await routeWebhookEvent(payload, db);
    
    const processingTime = Date.now() - startTime;
    webhookLogger.info('webhook_completed', { 
      event: payload.event_name, 
      userId: payload.userId, 
      processingTime,
      success: result.success 
    });

    return result;

  } catch (error) {
    const processingTime = Date.now() - startTime;
    webhookLogger.error('webhook_failed', { 
      event: payload.event_name, 
      userId: payload.userId, 
      processingTime,
      error 
    });

    return {
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
      processedAt: new Date()
    };
  }
}

// ===== EVENT ROUTING =====

async function routeWebhookEvent(payload: LemonEventPayload, db: Db): Promise<WebhookResult> {
  const { event_name, data, userId, resourceid } = payload;

  try {
    switch (event_name) {
      // Order Events
      case 'order_created':
        return await handleOrderCreated(data, db, userId, resourceid);
      
      case 'order_refunded':
        return await handleOrderRefunded(data, db, userId, resourceid);

      // Subscription Events
      case 'subscription_created':
        return await handleSubscriptionCreated(data, db, userId, resourceid);
      
      case 'subscription_updated':
        return await handleSubscriptionUpdated(data, db, userId, resourceid);
      
      case 'subscription_cancelled':
        return await handleSubscriptionCancelled(data, db, userId, resourceid);
      
      case 'subscription_expired':
        return await handleSubscriptionExpired(data, db, userId, resourceid);
      
      case 'subscription_paused':
        return await handleSubscriptionPaused(data, db, userId, resourceid);
      
      case 'subscription_resumed':
        return await handleSubscriptionResumed(data, db, userId, resourceid);
      
      case 'subscription_unpaused':
        return await handleSubscriptionUnpaused(data, db, userId, resourceid);
      
      case 'subscription_plan_changed':
        return await handleSubscriptionPlanChanged(data, db, userId, resourceid);

      // Payment Events
      case 'subscription_payment_failed':
        return await handleSubscriptionPaymentFailed(data, db, userId, resourceid);
      
      case 'subscription_payment_success':
        return await handleSubscriptionPaymentSuccess(data, db, userId, resourceid);
      
      case 'subscription_payment_recovered':
        return await handleSubscriptionPaymentRecovered(data, db, userId, resourceid);
      
      case 'subscription_payment_refunded':
        return await handleSubscriptionPaymentRefunded(data, db, userId, resourceid);

      default:
        webhookLogger.warn('unhandled_event', `Unhandled LemonSqueezy event: ${event_name}`);
        return {
          success: true,
          message: `Event ${event_name} not handled (not critical)`,
          processedAt: new Date()
        };
    }
  } catch (error) {
    webhookLogger.error(`handler_${event_name}_failed`, error);
    throw error;
  }
}

// ===== ORDER EVENT HANDLERS =====

async function handleOrderCreated(
  orderData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const productId = orderData.attributes?.first_order_item?.product_id;
    const productType = getProductType(productId?.toString());

    if (!productType) {
      webhookLogger.warn('order_created_invalid_product', { productId, userId });
      return {
        success: false,
        message: 'Unhandled or missing product_id',
        processedAt: new Date()
      };
    }

    // Insert order record
    await insertOrder(db, productType, orderData);

    // Handle resource-specific logic
    if (resourceid) {
      await handleResourceOrderCreated(db, productType, resourceid, userId);
    }

    webhookLogger.info('order_created_success', { productType, userId, resourceid });
    
    return {
      success: true,
      message: `Order created successfully for ${productType}`,
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('order_created_failed', error);
    throw error;
  }
}

async function handleOrderRefunded(
  orderData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const productId = orderData.attributes?.first_order_item?.product_id;
    const productType = getProductType(productId?.toString());

    if (!productType) {
      webhookLogger.warn('order_refunded_invalid_product', { productId, userId });
      return {
        success: false,
        message: 'Unhandled or missing product_id',
        processedAt: new Date()
      };
    }

    // Mark order as refunded
    const collection = productType === 'blog' ? 'premium_blog_orders' : 'premium_app_orders';
    await db.collection(collection).updateOne(
      { orderId: orderData.id },
      { $set: { status: 'refunded', refundedAt: new Date() } }
    );

    // Revoke premium access
    await updateUserProStatus(db, userId, false);

    // Handle resource-specific refund logic
    if (resourceid) {
      await handleResourceOrderRefunded(db, productType, resourceid, userId);
    }

    webhookLogger.info('order_refunded_success', { productType, userId, resourceid });
    
    return {
      success: true,
      message: `Order refunded successfully for ${productType}`,
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('order_refunded_failed', error);
    throw error;
  }
}

// ===== SUBSCRIPTION EVENT HANDLERS =====

async function handleSubscriptionCreated(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const productId = subscriptionData.attributes?.product_id;
    const variantId = subscriptionData.attributes?.variant_id;
    const renewsAt = subscriptionData.attributes?.renews_at;

    if (!productId || !variantId || !renewsAt) {
      webhookLogger.warn('subscription_created_missing_data', { productId, variantId, renewsAt, userId });
      return {
        success: false,
        message: 'Missing subscription data fields',
        processedAt: new Date()
      };
    }

    const productType = getProductType(productId.toString());
    if (productType !== 'blog') {
      webhookLogger.info('subscription_created_non_blog', { productType, userId });
      return {
        success: true,
        message: `Subscription created for ${productType} (not blog)`,
        processedAt: new Date()
      };
    }

    // Verify user exists
    const user = await getUserById(db, userId);
    if (!user) {
      webhookLogger.warn('subscription_created_user_not_found', { userId });
      return {
        success: false,
        message: 'User not found',
        processedAt: new Date()
      };
    }

    // Process subscription
    const plan = getPlanType(variantId.toString());
    const startsAt = new Date();
    const expiresAt = new Date(renewsAt);

    await upsertSubscriptionAccess(db, subscriptionData.id, userId, plan, startsAt, expiresAt);
    await updateUserProStatus(db, userId, true);

    // Handle resource-specific logic
    if (resourceid) {
      await handleResourceSubscriptionCreated(db, resourceid, userId);
    }

    webhookLogger.info('subscription_created_success', { userId, plan, resourceid });
    
    return {
      success: true,
      message: 'Subscription created successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_created_failed', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const status = subscriptionData.attributes?.status;
    const id = subscriptionData.id;
    const renewsAt = subscriptionData.attributes?.renews_at;

    if (!id || !status) {
      webhookLogger.warn('subscription_updated_missing_data', { id, status, userId });
      return {
        success: false,
        message: 'Missing subscription id or status',
        processedAt: new Date()
      };
    }

    if (status === 'active' && renewsAt) {
      await updateSubscriptionStatus(db, id, 'active', renewsAt);
    }

    webhookLogger.info('subscription_updated_success', { subscriptionId: id, status, userId });
    
    return {
      success: true,
      message: 'Subscription updated successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_updated_failed', error);
    throw error;
  }
}

async function handleSubscriptionCancelled(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_cancelled_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    await updateSubscriptionStatus(db, id, 'cancelled');
    await updateUserProStatus(db, userId, false);

    // Handle resource-specific cancellation logic
    if (resourceid) {
      await handleResourceSubscriptionCancelled(db, resourceid, userId);
    }

    webhookLogger.info('subscription_cancelled_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription cancelled successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_cancelled_failed', error);
    throw error;
  }
}

async function handleSubscriptionExpired(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_expired_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    await updateSubscriptionStatus(db, id, 'expired');
    await updateUserProStatus(db, userId, false);

    // Handle resource-specific expiration logic
    if (resourceid) {
      await handleResourceSubscriptionExpired(db, resourceid, userId);
    }

    webhookLogger.info('subscription_expired_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription expired successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_expired_failed', error);
    throw error;
  }
}

async function handleSubscriptionPaused(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_paused_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    await updateSubscriptionStatus(db, id, 'paused');
    await updateUserProStatus(db, userId, false);

    // Handle resource-specific pause logic
    if (resourceid) {
      await handleResourceSubscriptionPaused(db, resourceid, userId);
    }

    webhookLogger.info('subscription_paused_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription paused successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_paused_failed', error);
    throw error;
  }
}

async function handleSubscriptionResumed(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_resumed_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    await updateSubscriptionStatus(db, id, 'active');
    await updateUserProStatus(db, userId, true);

    // Handle resource-specific resume logic
    if (resourceid) {
      await handleResourceSubscriptionResumed(db, resourceid, userId);
    }

    webhookLogger.info('subscription_resumed_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription resumed successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_resumed_failed', error);
    throw error;
  }
}

async function handleSubscriptionUnpaused(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_unpaused_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    await updateSubscriptionStatus(db, id, 'active');
    await updateUserProStatus(db, userId, true);

    // Handle resource-specific unpause logic
    if (resourceid) {
      await handleResourceSubscriptionUnpaused(db, resourceid, userId);
    }

    webhookLogger.info('subscription_unpaused_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription unpaused successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_unpaused_failed', error);
    throw error;
  }
}

async function handleSubscriptionPlanChanged(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;
    const newPlanId = subscriptionData.attributes?.variant_id;

    if (!id || !newPlanId) {
      webhookLogger.warn('subscription_plan_changed_missing_data', { id, newPlanId, userId });
      return {
        success: false,
        message: 'Missing subscription id or new plan id',
        processedAt: new Date()
      };
    }

    // Update subscription with new plan
    await db.collection('blog_premium_access').updateOne(
      { subscriptionId: id },
      { 
        $set: { 
          planId: newPlanId, 
          planChangedAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    webhookLogger.info('subscription_plan_changed_success', { subscriptionId: id, newPlanId, userId });
    
    return {
      success: true,
      message: 'Subscription plan changed successfully',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_plan_changed_failed', error);
    throw error;
  }
}

// ===== PAYMENT EVENT HANDLERS =====

async function handleSubscriptionPaymentFailed(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_payment_failed_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    // Update subscription status to payment_failed
    await updateSubscriptionStatus(db, id, 'payment_failed');
    
    // Optionally pause user access
    await updateUserProStatus(db, userId, false);

    webhookLogger.info('subscription_payment_failed_success', { subscriptionId: id, userId });
    
    return {
      success: true,
      message: 'Subscription payment failure handled',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_payment_failed_handler_failed', error);
    throw error;
  }
}

async function handleSubscriptionPaymentSuccess(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_payment_success_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    // Reactivate subscription if it was paused due to payment failure
    await updateSubscriptionStatus(db, id, 'active');
    await updateUserProStatus(db, userId, true);

    webhookLogger.info('subscription_payment_success_handled', { subscriptionId: id, userId });
    
    return {
      success: true,
      message: 'Subscription payment success handled',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_payment_success_handler_failed', error);
    throw error;
  }
}

async function handleSubscriptionPaymentRecovered(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_payment_recovered_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    // Reactivate subscription
    await updateSubscriptionStatus(db, id, 'active');
    await updateUserProStatus(db, userId, true);

    webhookLogger.info('subscription_payment_recovered_success', { subscriptionId: id, userId });
    
    return {
      success: true,
      message: 'Subscription payment recovery handled',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_payment_recovered_handler_failed', error);
    throw error;
  }
}

async function handleSubscriptionPaymentRefunded(
  subscriptionData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    const id = subscriptionData.id;

    if (!id) {
      webhookLogger.warn('subscription_payment_refunded_missing_id', { userId });
      return {
        success: false,
        message: 'Missing subscription id',
        processedAt: new Date()
      };
    }

    // Cancel subscription due to refund
    await updateSubscriptionStatus(db, id, 'cancelled');
    await updateUserProStatus(db, userId, false);

    // Handle resource-specific refund logic
    if (resourceid) {
      await handleResourceSubscriptionRefunded(db, resourceid, userId);
    }

    webhookLogger.info('subscription_payment_refunded_success', { subscriptionId: id, userId, resourceid });
    
    return {
      success: true,
      message: 'Subscription payment refund handled',
      processedAt: new Date()
    };

  } catch (error) {
    webhookLogger.error('subscription_payment_refunded_handler_failed', error);
    throw error;
  }
}

// ===== RESOURCE-SPECIFIC HANDLERS =====

async function handleResourceOrderCreated(
  db: Db, 
  productType: string, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    if (productType === 'blog') {
      // Mark blog draft as premium-ready
      const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
      if (draftObjectId) {
        await db.collection('blog_drafts').updateOne(
          { _id: draftObjectId, userId: userId },
          { 
            $set: { 
              premiumReady: true, 
              premiumReadyAt: new Date(),
              premiumUserId: userId
            } 
          }
        );
        webhookLogger.info('blog_draft_premium_ready', { draftId: resourceid, userId });
      }
    } else if (productType === 'app') {
      // Mark app as premium in userapps collection
      const appObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
      if (appObjectId) {
        await updateAppPremiumStatus(db, resourceid, 'active', userId);
        webhookLogger.info('app_premium_activated', { appId: resourceid, userId });
      }
    }
  } catch (error) {
    webhookLogger.error('resource_order_created_failed', error);
    // Don't throw - this is not critical to the main webhook flow
  }
}

async function handleResourceOrderRefunded(
  db: Db, 
  productType: string, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    if (productType === 'blog') {
      // Mark blog draft as premium-revoked
      const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
      if (draftObjectId) {
        await db.collection('blog_drafts').updateOne(
          { _id: draftObjectId, userId: userId },
          { 
            $set: { 
              premiumReady: false, 
              premiumRevokedAt: new Date()
            } 
          }
        );
      }
    } else if (productType === 'app') {
      // Mark app as premium-revoked in userapps collection
      const appObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
      if (appObjectId) {
        await updateAppPremiumStatus(db, resourceid, 'revoked', userId);
        webhookLogger.info('app_premium_revoked', { appId: resourceid, userId });
      }
    }
  } catch (error) {
    webhookLogger.error('resource_order_refunded_failed', error);
  }
}

async function handleResourceSubscriptionCreated(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-ready
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: true, 
            premiumReadyAt: new Date(),
            premiumUserId: userId
          } 
        }
      );
      webhookLogger.info('blog_draft_premium_ready', { draftId: resourceid, userId });
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_created_failed', error);
  }
}

async function handleResourceSubscriptionCancelled(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-revoked
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: false, 
            premiumRevokedAt: new Date()
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_cancelled_failed', error);
  }
}

async function handleResourceSubscriptionExpired(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-expired
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: false, 
            premiumExpiredAt: new Date()
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_expired_failed', error);
  }
}

async function handleResourceSubscriptionPaused(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-paused
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: false, 
            premiumPausedAt: new Date()
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_paused_failed', error);
  }
}

async function handleResourceSubscriptionResumed(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-resumed
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: true, 
            premiumResumedAt: new Date(),
            premiumUserId: userId
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_resumed_failed', error);
  }
}

async function handleResourceSubscriptionUnpaused(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-unpaused
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: true, 
            premiumUnpausedAt: new Date(),
            premiumUserId: userId
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_unpaused_failed', error);
  }
}

async function handleResourceSubscriptionRefunded(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    // Mark blog draft as premium-refunded
    const draftObjectId = ObjectId.isValid(resourceid) ? new ObjectId(resourceid) : null;
    if (draftObjectId) {
      await db.collection('blog_drafts').updateOne(
        { _id: draftObjectId, userId: userId },
        { 
          $set: { 
            premiumReady: false, 
            premiumRefundedAt: new Date()
          } 
        }
      );
    }
  } catch (error) {
    webhookLogger.error('resource_subscription_refunded_failed', error);
  }
}
      