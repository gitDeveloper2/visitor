// services/lemonSqueezy.ts

import type { Db } from 'mongodb';
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
} from './db';

export interface LemonEventPayload {
  event_name: string;
  data: any;
}

export async function handleLemonWebhook(payload: LemonEventPayload) {
  const { db } = await connectToDatabase();
console.log("connection")
  switch (payload.event_name) {
    case 'order_created':
      await handleOrderCreated(payload.data, db);
      break;
    case 'subscription_created':
      await handleSubscriptionCreated(payload.data, db);
      break;
    case 'subscription_updated':
      await handleSubscriptionUpdated(payload.data, db);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(payload.data, db);
      break;
    case 'subscription_expired':
      await handleSubscriptionExpired(payload.data, db);
      break;
      case 'subscription_paused':
        await handleSubscriptionPaused(payload.data, db);
        break;
    case 'order_refunded':
            await handleOrderRefunded(payload.data, db);
            break;
            case 'subscription_updated':
                await handleSubscriptionUpdated(payload.data, db);
                break;
              case 'subscription_resumed':
                await handleSubscriptionResumed(payload.data, db);
                break;
              case 'subscription_expired':
                await handleSubscriptionExpired(payload.data, db);
                break;
              case 'subscription_paused':
                await handleSubscriptionPaused(payload.data, db);
                break;
              case 'subscription_unpaused':
                await handleSubscriptionUnpaused(payload.data, db);
                break;
              case 'subscription_plan_changed':
                await handleSubscriptionPlanChanged(payload.data, db);
                break;
              
          
    default:
      console.log(`Unhandled LemonSqueezy event: ${payload.event_name}`);
  }
}

// === Individual Event Handlers ===

async function handleOrderCreated(orderData: any, db: Db) {
  const productId =  orderData.attributes.first_order_item?.product_id;
  const productType = getProductType(productId?.toString());

  if (!productType) {
    console.warn('Unhandled or missing product_id:', productId);
    return;
  }

  await insertOrder(db, productType, orderData);
}

async function handleSubscriptionCreated(subscriptionData: any, db: Db) {
  const productId = subscriptionData.attributes?.product_id;
  const variantId = subscriptionData.attributes?.variant_id;
  const customerEmail = subscriptionData.attributes?.user_email;
  const renewsAt = subscriptionData.attributes?.renews_at;

  if (!productId || !variantId || !customerEmail || !renewsAt) {
    console.warn('Missing subscription data fields');
    return;
  }

  const productType = getProductType(productId.toString());
  if (productType !== 'blog') return;

  const user = await getUserByEmail(db, customerEmail);
  if (!user) {
    console.warn('User not found for email:', customerEmail);
    return;
  }

  const plan = getPlanType(variantId.toString());
  const startsAt = new Date();
  const expiresAt = new Date(renewsAt);

  await upsertSubscriptionAccess(db, subscriptionData.id, user._id.toString(), plan, startsAt, expiresAt);
  await updateUserProStatus(db, user._id.toString(), true);
}

async function handleSubscriptionUpdated(subscriptionData: any, db: Db) {
  const status = subscriptionData.attributes?.status;
  const id = subscriptionData.id
  const renewsAt =subscriptionData.attributes?.renews_at;

  if (!id || !status) {
    console.warn('Missing subscription id or status');
    return;
  }

  if (status === 'active' && renewsAt) {
    await updateSubscriptionStatus(db, id, 'active', renewsAt);
  }
}

async function handleSubscriptionCancelled(subscriptionData: any, db: Db) {
  const id = subscriptionData.id
  const customerEmail =  subscriptionData.attributes?.user_email;

  if (!id) {
    console.warn('Missing subscription id');
    return;
  }

  await updateSubscriptionStatus(db, id, 'cancelled');

  if (customerEmail) {
    const user = await getUserByEmail(db, customerEmail);
    if (user) {
      await updateUserProStatus(db, user._id.toString(), false);
    } else {
      console.warn('User not found for email:', customerEmail);
    }
  } else {
    const record = await getSubscriptionRecord(db, id);
    if (record) {
      const user = await getUserById(db, record.userId);
      if (user) {
        await updateUserProStatus(db, user._id.toString(), false);
      } else {
        console.warn('User not found for subscription userId');
      }
    } else {
      console.warn('No subscription record found for id:', id);
    }
  }
}

async function handleSubscriptionExpired(subscriptionData: any, db: Db) {
  const id = subscriptionData.id 
  const customerEmail = subscriptionData.customer_email ?? subscriptionData.attributes?.user_email;

  if (!id) {
    console.warn('Missing subscription id');
    return;
  }

  await updateSubscriptionStatus(db, id, 'expired');

  if (customerEmail) {
    const user = await getUserByEmail(db, customerEmail);
    if (user) {
      await updateUserProStatus(db, user._id.toString(), false);
    } else {
      console.warn('User not found for email:', customerEmail);
    }
  }
}
async function handleSubscriptionPaused(subscriptionData: any, db: Db) {
    const id = subscriptionData.id ?? subscriptionData.attributes?.id;
    const customerEmail = subscriptionData.customer_email ?? subscriptionData.attributes?.customer_email;
  
    if (!id) {
      console.warn('Missing subscription id in paused event');
      return;
    }
  
    await updateSubscriptionStatus(db, id, 'paused');
  
    if (customerEmail) {
      const user = await getUserByEmail(db, customerEmail);
      if (user) {
        await updateUserProStatus(db, user._id.toString(), false);
        console.log('User pro status set to false due to subscription pause:', user._id);
      } else {
        console.warn('User not found for email on subscription paused:', customerEmail);
      }
    } else {
      const record = await getSubscriptionRecord(db, id);
      if (record) {
        const user = await getUserById(db, record.userId);
        if (user) {
          await updateUserProStatus(db, user._id.toString(), false);
          console.log('User pro status set to false due to subscription pause:', user._id);
        } else {
          console.warn('User not found for subscription userId');
        }
      } else {
        console.warn('No subscription record found for id:', id);
      }
    }
  }
  async function handleOrderRefunded(orderData: any, db: Db) {
    const productId = orderData.product_id ?? orderData.attributes?.product_id;
    const customerEmail = orderData.customer_email ?? orderData.attributes?.customer_email;
    const orderId = orderData.id;
  
    if (!productId || !customerEmail || !orderId) {
      console.warn('Missing fields in order_refunded event');
      return;
    }
  console.log("refund")
    const productType = getProductType(productId.toString());
    if (!productType) {
      console.warn('Unhandled product type in refund:', productId);
      return;
    }
  
    // Mark order as refunded
    const collection = productType === 'blog' ? 'premium_blog_orders' : 'premium_app_orders';
    await db.collection(collection).updateOne(
      { orderId },
      { $set: { status: 'refunded', refundedAt: new Date() } }
    );
  
    // Revoke access if it's a blog product
    if (productType === 'blog') {
      const user = await getUserByEmail(db, customerEmail);
      if (user) {
        await updateUserProStatus(db, user._id.toString(), false);
        console.log('User pro status revoked due to refund:', user._id);
      } else {
        console.warn('User not found for refunded order:', customerEmail);
      }
    }
  
    console.log(`Order ${orderId} marked as refunded`);
  }
  async function handleSubscriptionResumed(data: any, db: Db) {
    const subscriptionId = data.id;
  
    await db.collection('subscriptions').updateOne(
      { subscriptionId },
      { $set: { status: 'active', resumedAt: new Date() } }
    );
  
    console.log(`Subscription ${subscriptionId} resumed`);
  }
  async function handleSubscriptionUnpaused(data: any, db: Db) {
    const subscriptionId = data.id;
  
    await db.collection('subscriptions').updateOne(
      { subscriptionId },
      { $set: { status: 'active', unpausedAt: new Date() } }
    );
  
    console.log(`Subscription ${subscriptionId} unpaused`);
  }
  async function handleSubscriptionPlanChanged(data: any, db: Db) {
    const subscriptionId = data.id;
    const newPlanId = data.variant_id;
  
    await db.collection('subscriptions').updateOne(
      { subscriptionId },
      { $set: { planId: newPlanId, planChangedAt: new Date() } }
    );
  
    console.log(`Subscription ${subscriptionId} changed to plan ${newPlanId}`);
  }
      