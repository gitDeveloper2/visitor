export interface LemonSqueezyProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  pay_what_you_want: boolean;
  has_discount: boolean;
  discount_amount: number;
  discount_percentage: number;
  currency: string;
  currency_symbol: string;
  status: string;
  status_formatted: string;
  thumb_url: string;
  large_thumb_url: string;
  has_license_key: boolean;
  license_limit: number;
  has_physical_delivery: boolean;
  has_custom_fields: boolean;
  has_variants: boolean;
  is_tax_exempt: boolean;
  redirect_url: string;
  has_webhook: boolean;
  sales_count: number;
  total_earnings: number;
  has_unlimited_plan_links: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface LemonSqueezyVariant {
  id: number;
  product_id: number;
  name: string;
  description: string;
  price: number;
  is_subscription: boolean;
  interval: string;
  interval_count: number;
  has_free_trial: boolean;
  trial_ends_at: string | null;
  pay_what_you_want: boolean;
  has_discount: boolean;
  discount_amount: number;
  discount_percentage: number;
  currency: string;
  currency_symbol: string;
  sales_count: number;
  total_earnings: number;
  status: string;
  status_formatted: string;
  created_at: string;
  updated_at: string;
}

export interface LemonSqueezyOrder {
  id: number;
  identifier: string;
  order_number: number;
  variant_id: number;
  product_id: number;
  product_name: string;
  variant_name: string;
  customer_email: string;
  customer_name: string;
  status: string;
  status_formatted: string;
  currency: string;
  currency_symbol: string;
  subtotal: number;
  discount_total: number;
  tax: number;
  total: number;
  subtotal_formatted: string;
  discount_total_formatted: string;
  tax_formatted: string;
  total_formatted: string;
  urls: {
    update_payment_method: string;
    customer_portal: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LemonSqueezySubscription {
  id: number;
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  product_slug: string;
  variant_slug: string;
  customer_email: string;
  customer_name: string;
  status: string;
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  trial_ends_at: string | null;
  renews_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LemonSqueezyWebhook {
  id: number;
  store_id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PremiumAccess {
  userId: string;
  type: 'blog' | 'app_listing';
  productId: number;
  variantId: number;
  orderId: number;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPremiumAccess {
  userId: string;
  subscriptionId: number;
  status: 'active' | 'expired' | 'cancelled';
  plan: 'monthly' | 'yearly';
  startsAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppPremiumListing {
  userId: string;
  appId: string;
  orderId: number;
  status: 'active' | 'expired';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 