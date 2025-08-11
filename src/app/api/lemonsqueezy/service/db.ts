// services/lemonSqueezy.ts

import { ObjectId, type Db } from 'mongodb';

export type OrderType = 'blog' | 'app';
export type PlanType = 'monthly' | 'yearly';

interface OrderAttributes {
  first_order_item?: {
    product_id?: number;
    variant_id?: number;
  };
  user_email?: string;
}

interface OrderData {
  id: string;
  attributes: OrderAttributes;
}

interface SubscriptionAttributes {
  product_id?: number;
  variant_id?: number;
  user_email?: string;
  renews_at?: string;
}

interface SubscriptionData {
  id: string;
  attributes: SubscriptionAttributes;
}

/**
 * Inserts a new order into the appropriate collection.
 */
export async function insertOrder(db: Db, type: OrderType, orderData: OrderData) {
  const collection = type === 'blog' ? 'premium_blog_orders' : 'premium_app_orders';
  const { id, attributes } = orderData;
  const { product_id, variant_id } = attributes?.first_order_item || {};
  const customerEmail = attributes?.user_email;

  return db.collection(collection).insertOne({
    orderId: id,
    productId: product_id,
    variantId: variant_id,
    customerEmail,
    createdAt: new Date(),
    status: 'created',
  });
}

/**
 * Updates the status of a subscription in the blog_premium_access collection.
 */
export async function updateSubscriptionStatus(db: Db, subscriptionId: string, status: string, expiresAt?: string) {
  const update: any = {
    status,
    updatedAt: new Date(),
  };
  if (expiresAt) {
    update.expiresAt = new Date(expiresAt);
  }

  return db.collection('blog_premium_access').updateOne(
    { subscriptionId },
    { $set: update }
  );
}

/**
 * Upserts a subscription access record for a user.
 */
export async function upsertSubscriptionAccess(
  db: Db,
  subscriptionId: string,
  userId: string,
  plan: PlanType,
  startsAt: Date,
  expiresAt: Date
) {
  return db.collection('blog_premium_access').updateOne(
    { subscriptionId },
    {
      $set: {
        userId,
        status: 'active',
        plan,
        startsAt,
        expiresAt,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        subscriptionId,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

/**
 * Updates a user's pro status by email or ID.
 */

export async function updateUserProStatus(db: Db, userIdOrEmail: string, pro: boolean) {
  const query = userIdOrEmail.includes('@')
    ? { email: userIdOrEmail }
    : { _id: new ObjectId(userIdOrEmail) };

  return db.collection('user').updateOne(query, { $set: { pro } });
}


/**
 * Retrieves a user by email.
 */
export async function getUserByEmail(db: Db, email: string) {
  return db.collection('user').findOne({ email });
}

/**
 * Retrieves a user by ID.
 */

export async function getUserById(db: Db, userId: string) {
  return db.collection('user').findOne({ _id: new ObjectId(userId) });
}


/**
 * Retrieves a subscription record by ID.
 */
export async function getSubscriptionRecord(db: Db, subscriptionId: string) {
  return db.collection('blog_premium_access').findOne({ subscriptionId });
}

/**
 * Determines the product type based on environment variables.
 */
export function getProductType(productId: string): OrderType | null {
  if (productId === process.env.NEXT_LEMON_SQUEEZY_PREMIUM_BLOG_PRODUCT_ID) return 'blog';
  if (productId === process.env.NEXT_LEMON_SQUEEZY_PREMIUM_APP_PRODUCT_ID) return 'app';
  return null;
}

/**
 * Determines the plan type based on variant ID.
 */
export function getPlanType(variantId: string): PlanType {
  return variantId === process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_YEARLY_VARIANT_ID ? 'yearly' : 'monthly';
}
