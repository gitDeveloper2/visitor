# Lemon Squeezy Integration Setup Guide

This guide will help you set up Lemon Squeezy for premium features in your Next.js application.

## Overview

The integration provides:
- **Premium Blog Subscriptions**: Monthly ($9.99) and Yearly ($99.99) plans
- **Premium App Listings**: One-time $19 upgrade for enhanced app visibility
- **Webhook Handling**: Automatic subscription management and access control
- **User Management**: Track premium status and subscription details

## Prerequisites

1. **Lemon Squeezy Account**: Sign up at [lemonsqueezy.com](https://lemonsqueezy.com)
2. **Store Setup**: Create a store and configure your products
3. **API Access**: Get your API key from the Lemon Squeezy dashboard

## Step 1: Create Products in Lemon Squeezy

### Premium Blog Subscription Product
1. Go to your Lemon Squeezy dashboard
2. Create a new product called "Premium Blog Access"
3. Set up two variants:
   - **Monthly Plan**: $9.99/month
   - **Yearly Plan**: $99.99/year
4. Note down the Product ID and Variant IDs

### Premium App Listing Product
1. Create another product called "Premium App Listing"
2. Set price to $19 (one-time payment)
3. Note down the Product ID and Variant ID

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here

# Product IDs (replace with actual IDs from your store)
LEMON_SQUEEZY_PREMIUM_BLOG_PRODUCT_ID=12345
LEMON_SQUEEZY_PREMIUM_APP_PRODUCT_ID=67890

# Variant IDs (replace with actual variant IDs)
LEMON_SQUEEZY_BLOG_MONTHLY_VARIANT_ID=111
LEMON_SQUEEZY_BLOG_YEARLY_VARIANT_ID=222
LEMON_SQUEEZY_APP_LISTING_VARIANT_ID=333

# Webhook Secret (for verifying webhook signatures)
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 3: Configure Webhooks

1. In your Lemon Squeezy dashboard, go to Settings > Webhooks
2. Add a new webhook with URL: `https://yourdomain.com/api/lemonsqueezy/webhook`
3. Select these events:
   - `order_created`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
4. Copy the webhook secret to your `.env.local` file

## Step 4: Install Dependencies

```bash
npm install @lemonsqueezy/lemonsqueezy.js @lemonsqueezy/react
```

## Step 5: Database Setup

The integration creates new collections in your MongoDB database:

- `blogpremiumaccess`: Tracks blog subscription status
- `apppremiumlistings`: Tracks premium app listings
- `premiumaccess`: General premium access tracking

## Step 6: Usage Examples

### Premium Blog Subscription Component
```tsx
import PremiumBlogSubscription from '@components/premium/PremiumBlogSubscription';

<PremiumBlogSubscription
  userEmail="user@example.com"
  userName="John Doe"
  isPremium={false}
/>
```

### Premium App Listing Component
```tsx
import PremiumAppListing from '@components/premium/PremiumAppListing';

<PremiumAppListing
  appId="app123"
  appName="My Awesome App"
  userEmail="user@example.com"
  userName="John Doe"
  isPremium={false}
/>
```

### Content Guard Component
```tsx
import PremiumContentGuard from '@components/premium/PremiumContentGuard';

<PremiumContentGuard
  isPremium={userHasPremiumAccess}
  contentType="blog"
  contentTitle="Premium Article Title"
>
  <div>Your premium content here...</div>
</PremiumContentGuard>
```

## Step 7: Testing

1. **Test Checkout Flow**:
   - Use test mode in Lemon Squeezy
   - Create test orders and subscriptions
   - Verify webhook delivery

2. **Test Webhook Handling**:
   - Check webhook endpoint responses
   - Verify database updates
   - Test subscription lifecycle events

3. **Test User Access**:
   - Verify premium content access
   - Test subscription expiration
   - Check premium status updates

## Step 8: Production Deployment

1. **Update Environment Variables**:
   - Use production API keys
   - Update webhook URLs to production domain
   - Set proper webhook secrets

2. **Security Considerations**:
   - Implement proper webhook signature verification
   - Use HTTPS for all webhook endpoints
   - Monitor webhook delivery and failures

3. **Monitoring**:
   - Set up logging for webhook events
   - Monitor subscription status changes
   - Track premium feature usage

## File Structure

```
src/
├── components/premium/
│   ├── PremiumBlogSubscription.tsx
│   ├── PremiumAppListing.tsx
│   └── PremiumContentGuard.tsx
├── lib/
│   └── lemonsqueezy.ts
├── models/
│   └── PremiumAccess.ts
├── app/api/lemonsqueezy/
│   ├── webhook/route.ts
│   └── connect-order/route.ts
└── app/(site)/premium/
    └── page.tsx
```

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**:
   - Check webhook URL accessibility
   - Verify webhook secret configuration
   - Check server logs for errors

2. **Subscription Status Not Updating**:
   - Verify webhook event handling
   - Check database connection
   - Review webhook payload structure

3. **Checkout Flow Issues**:
   - Verify product and variant IDs
   - Check environment variable configuration
   - Test checkout URL generation

### Support

- **Lemon Squeezy Documentation**: [docs.lemonsqueezy.com](https://docs.lemonsqueezy.com)
- **API Reference**: [api.lemonsqueezy.com](https://api.lemonsqueezy.com)
- **Webhook Testing**: Use tools like ngrok for local development

## Next Steps

After setup, consider implementing:

1. **Analytics Dashboard**: Track premium feature usage
2. **Email Notifications**: Send subscription confirmations
3. **Premium Content Management**: Admin tools for content control
4. **User Dashboard**: Subscription management interface
5. **Payment Analytics**: Revenue tracking and reporting

## Security Notes

- Always verify webhook signatures in production
- Use environment variables for sensitive data
- Implement rate limiting on webhook endpoints
- Monitor for suspicious webhook activity
- Regularly rotate API keys and webhook secrets 