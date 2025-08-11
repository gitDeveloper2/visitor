import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js';

// Server-side only: Lemon Squeezy client
export const lemonSqueezyClient = typeof window === 'undefined' 
  ? new LemonSqueezy(process.env.LEMON_SQUEEZY_API_KEY || '') 
  : null;

// Product and Variant IDs from environment variables (no changes to your variable names)
export const PRODUCT_IDS = {
  PREMIUM_BLOG_SUBSCRIPTION: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_BLOG_PRODUCT_ID,
  PREMIUM_APP_LISTING: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_APP_PRODUCT_ID,
} as const;

export const VARIANT_IDS = {
  PREMIUM_BLOG_MONTHLY: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_MONTHLY_VARIANT_ID,
  PREMIUM_BLOG_YEARLY: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_YEARLY_VARIANT_ID,
  PREMIUM_APP_LISTING: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_APP_LISTING_VARIANT_ID,
} as const;

// Generate checkout URL with correct variant ID included in path
export const getCheckoutUrl = (
  variantId: string,
  options: {
    email?: string;
    name?: string;
    custom?: Record<string, any>;
  } = {}
) => {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  if (!storeId) throw new Error('NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID is not defined');
  if (!variantId) throw new Error('Variant ID is required');

  const baseUrl = `https://${storeId}.lemonsqueezy.com/checkout/buy/${variantId}`;
  const params = new URLSearchParams();

  if (options.email) params.append('checkout[email]', options.email);
  if (options.name) params.append('checkout[name]', options.name);

  Object.entries(options.custom || {}).forEach(([key, value]) => {
    params.append(`checkout[custom][${key}]`, String(value));
  });

  return `${baseUrl}?${params.toString()}`;
};

// Placeholder webhook verification function
export const verifyWebhookSignature = (payload: string, signature: string) => {
  // Implement using crypto and LEMON_SQUEEZY_WEBHOOK_SECRET in production
  return true;
};
