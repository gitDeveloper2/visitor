# Lemon Squeezy Webhook System Documentation

## Overview

This document describes the comprehensive, modular webhook system for handling Lemon Squeezy payment events. The system is designed to be reliable, maintainable, and easily extensible for both blog and app premium features.

## Architecture

### Core Components

1. **Webhook Route** (`/api/lemonsqueezy/webhook/route.ts`)
   - Entry point for all Lemon Squeezy webhooks
   - Handles signature verification and payload validation
   - Routes events to appropriate handlers

2. **Webhook Service** (`/api/lemonsqueezy/service/lemonSqueezy.ts`)
   - Main business logic for processing webhook events
   - Modular event handlers for each Lemon Squeezy event type
   - Resource-specific logic for blogs and apps

3. **Webhook Logger** (`/api/lemonsqueezy/service/webhookLogger.ts`)
   - Comprehensive logging and monitoring
   - Tracks webhook processing status and performance
   - Enables debugging and retry mechanisms

4. **Admin Dashboard** (`/api/lemonsqueezy/admin/webhook-stats/route.ts`)
   - Monitor webhook statistics and performance
   - Retry failed webhooks
   - Clean up old logs

## Supported Events

### Order Events
- `order_created` - New order placed
- `order_refunded` - Order refunded

### Subscription Events
- `subscription_created` - New subscription started
- `subscription_updated` - Subscription updated
- `subscription_cancelled` - Subscription cancelled
- `subscription_expired` - Subscription expired
- `subscription_paused` - Subscription paused
- `subscription_resumed` - Subscription resumed
- `subscription_unpaused` - Subscription unpaused
- `subscription_plan_changed` - Subscription plan changed

### Payment Events
- `subscription_payment_failed` - Payment failed
- `subscription_payment_success` - Payment successful
- `subscription_payment_recovered` - Payment recovered
- `subscription_payment_refunded` - Payment refunded

## Data Flow

### 1. Webhook Reception
```
Lemon Squeezy → Webhook Route → Signature Verification → Payload Validation
```

### 2. Event Processing
```
Validated Payload → Event Router → Specific Handler → Database Updates
```

### 3. Resource Management
```
Handler → Resource-Specific Logic → Update Blog Drafts/Apps → User Status Updates
```

## Database Collections

### Core Collections
- `webhook_logs` - Webhook processing logs
- `premium_blog_orders` - Blog premium orders
- `premium_app_orders` - App premium orders
- `blog_premium_access` - Blog subscription access
- `user` - User accounts with pro status
- `blog_drafts` - Blog drafts with premium status

### Webhook Logs Schema
```typescript
interface WebhookLogEntry {
  id: string;                    // Unique log identifier
  eventName: string;             // Lemon Squeezy event name
  userId: string;                // MongoDB user ID
  resourceId?: string;           // Optional resource ID (draft_id, app_id)
  payload: any;                  // Sanitized webhook payload
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;              // Retry attempts
  maxAttempts: number;           // Maximum retry attempts (default: 3)
  startedAt: Date;               // Processing start time
  completedAt?: Date;            // Processing completion time
  processingTime?: number;       // Total processing time in ms
  error?: string;                // Error message if failed
  result?: any;                  // Processing result
  createdAt: Date;               // Log creation time
  updatedAt: Date;               // Last update time
}
```

## Configuration

### Environment Variables
```bash
# Required
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id

# Product IDs
NEXT_LEMON_SQUEEZY_PREMIUM_BLOG_PRODUCT_ID=123
NEXT_LEMON_SQUEEZY_PREMIUM_APP_PRODUCT_ID=456

# Variant IDs
NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_YEARLY_VARIANT_ID=789
NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_MONTHLY_VARIANT_ID=101
```

### Checkout Integration
When creating checkout sessions, include user data in custom fields:

```typescript
const customPayload = {
  user_id: session.user.id,        // MongoDB ObjectId
  draft_id: draftId,               // For blog submissions
  app_id: appId,                   // For app submissions
  return_url: returnUrl
};
```

## Usage Examples

### 1. Basic Webhook Processing
The system automatically processes webhooks when they arrive at `/api/lemonsqueezy/webhook`.

### 2. Monitor Webhook Statistics
```bash
# Get overall statistics
GET /api/lemonsqueezy/admin/webhook-stats?action=stats

# Get failed webhooks
GET /api/lemonsqueezy/admin/webhook-stats?action=failed

# Get logs for specific user
GET /api/lemonsqueezy/admin/webhook-stats?action=user&userId=123

# Get logs for specific event
GET /api/lemonsqueezy/admin/webhook-stats?action=event&eventName=subscription_created
```

### 3. Retry Failed Webhooks
```bash
POST /api/lemonsqueezy/admin/webhook-stats
{
  "logId": "webhook_1234567890_abc123"
}
```

### 4. Clean Up Old Logs
```bash
GET /api/lemonsqueezy/admin/webhook-stats?action=cleanup&days=30
```

## Extending the System

### Adding New Event Types

1. **Add Event Handler**
```typescript
// In lemonSqueezy.ts
async function handleNewEvent(
  eventData: any, 
  db: Db, 
  userId: string, 
  resourceid?: string
): Promise<WebhookResult> {
  try {
    // Your event handling logic here
    
    return {
      success: true,
      message: 'New event processed successfully',
      processedAt: new Date()
    };
  } catch (error) {
    webhookLogger.error('new_event_failed', error);
    throw error;
  }
}
```

2. **Add to Event Router**
```typescript
// In routeWebhookEvent function
case 'new_event':
  return await handleNewEvent(data, db, userId, resourceid);
```

### Adding New Resource Types

1. **Create Resource Handler**
```typescript
async function handleNewResourceEvent(
  db: Db, 
  resourceid: string, 
  userId: string
): Promise<void> {
  try {
    await db.collection('new_resources').updateOne(
      { _id: resourceid },
      { 
        $set: { 
          premiumStatus: 'active',
          premiumActivatedAt: new Date(),
          premiumUserId: userId
        } 
      }
    );
  } catch (error) {
    webhookLogger.error('new_resource_event_failed', error);
  }
}
```

2. **Integrate with Event Handlers**
```typescript
// In your event handler
if (resourceid) {
  await handleNewResourceEvent(db, resourceid, userId);
}
```

## Error Handling

### Automatic Retries
- Failed webhooks are automatically retried up to 3 times
- Exponential backoff between retry attempts
- Failed webhooks are logged for manual intervention

### Error Categories
1. **Validation Errors** - Invalid payload structure
2. **Authentication Errors** - Invalid webhook signature
3. **Processing Errors** - Business logic failures
4. **Database Errors** - Data persistence failures

### Error Recovery
- Manual retry through admin dashboard
- Automatic cleanup of old failed logs
- Comprehensive error logging for debugging

## Monitoring and Debugging

### Log Levels
- **INFO** - Normal operations and successful processing
- **WARN** - Non-critical issues and missing data
- **ERROR** - Critical failures and exceptions

### Key Metrics
- Total webhook count
- Success/failure rates
- Average processing time
- Retry attempt counts
- Resource-specific processing status

### Debugging Tools
- Webhook payload validation
- Processing time tracking
- Resource status tracking
- User premium status verification

## Security Features

### Signature Verification
- HMAC-SHA256 signature validation
- Timing-safe comparison to prevent timing attacks
- Environment variable configuration

### Data Sanitization
- Sensitive payment information removed from logs
- User privacy protection
- Audit trail maintenance

### Access Control
- Admin-only access to webhook statistics
- Session-based authentication
- Role-based permissions

## Performance Considerations

### Database Optimization
- Indexed queries on user ID and event type
- Efficient aggregation pipelines for statistics
- Automatic cleanup of old logs

### Processing Efficiency
- Asynchronous event handling
- Resource-specific logic separation
- Minimal database round trips

### Scalability
- Modular architecture for easy scaling
- Stateless webhook processing
- Horizontal scaling support

## Troubleshooting

### Common Issues

1. **Webhook Not Received**
   - Check Lemon Squeezy webhook configuration
   - Verify endpoint URL accessibility
   - Check server logs for errors

2. **Signature Verification Failed**
   - Verify `LEMON_SQUEEZY_WEBHOOK_SECRET` environment variable
   - Check webhook secret in Lemon Squeezy dashboard
   - Ensure no proxy interference

3. **User Not Found**
   - Verify `user_id` is included in checkout custom data
   - Check user exists in database
   - Validate MongoDB ObjectId format

4. **Resource Not Updated**
   - Check `resourceid` format and validity
   - Verify resource exists in database
   - Check resource-specific handler logic

### Debug Commands

```bash
# Check webhook endpoint health
curl https://yourdomain.com/api/lemonsqueezy/webhook

# View webhook statistics
curl "https://yourdomain.com/api/lemonsqueezy/admin/webhook-stats?action=stats"

# Check specific user logs
curl "https://yourdomain.com/api/lemonsqueezy/admin/webhook-stats?action=user&userId=123"
```

## Best Practices

### Development
1. Always test webhook handling with test events
2. Use staging environment for webhook testing
3. Implement comprehensive error handling
4. Add detailed logging for debugging

### Production
1. Monitor webhook success rates regularly
2. Set up alerts for webhook failures
3. Regularly clean up old webhook logs
4. Monitor processing performance

### Maintenance
1. Review webhook statistics weekly
2. Clean up failed webhooks monthly
3. Update event handlers as needed
4. Monitor Lemon Squeezy API changes

## Support and Maintenance

### Regular Tasks
- Monitor webhook success rates
- Review failed webhook logs
- Clean up old webhook data
- Update event handlers for new features

### Emergency Procedures
- Disable webhook processing if needed
- Manual processing of critical events
- Rollback to previous webhook logic
- Contact Lemon Squeezy support if needed

---

This webhook system provides a robust, scalable foundation for handling Lemon Squeezy payment events. It's designed to be reliable, maintainable, and easily extensible for future requirements. 