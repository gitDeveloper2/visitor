# Draft Management Features

## Overview
This document describes the enhanced draft management system that provides users with better control over their blog drafts and payment retry functionality.

## Key Features

### 1. Draft Expiration System
- **7-Day Limit**: All drafts automatically expire after 7 days
- **Auto-Deletion**: Expired drafts are automatically removed from the system
- **No External Notifications**: Users are not sent emails about expiring drafts

### 2. Countdown Timer
- **Real-time Countdown**: Shows remaining time in days, hours, minutes, and seconds
- **Visual Indicators**: 
  - Green border: Normal draft
  - Yellow border: Expires within 24 hours
  - Red border: Expired draft
- **Warning Alerts**: Notifies users when drafts are expiring soon

### 3. Payment Retry Functionality
- **Retry from Drafts**: Users can retry payment directly from the drafts section
- **Draft Preservation**: Failed payments don't lose user work
- **Seamless Flow**: Users can continue where they left off

### 4. Enhanced Draft Display
- **Status Indicators**: Clear visual status for each draft
- **Expiry Information**: Shows creation date and remaining time
- **Action Buttons**: Edit, retry payment, or delete options

## Technical Implementation

### API Endpoints

#### `/api/user-blogs/drafts`
- **GET**: Fetches user drafts with expiry information
- **Response**: Includes `expiryDate`, `remainingDays`, `isExpired` fields

#### `/api/user-blogs/draft/[id]/retry-payment`
- **POST**: Creates new checkout session for draft payment retry
- **Body**: `{ variantId: string }`
- **Response**: `{ checkoutUrl: string }`

#### `/api/cron/cleanup-drafts`
- **GET/POST**: Automated cleanup of expired drafts
- **Logic**: Removes drafts older than 7 days
- **Usage**: Can be called by external cron services

### Database Schema Updates

#### `blog_drafts` Collection
```typescript
interface BlogDraft {
  _id: ObjectId;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  role: string;
  authorBio: string;
  founderUrl: string;
  isFounderStory: boolean;
  premiumReady: boolean;
  createdAt: Date;
  updatedAt: Date;
  // New fields for expiry tracking
  expiryDate: Date; // Calculated field
  remainingDays: number; // Calculated field
  isExpired: boolean; // Calculated field
}
```

### Frontend Components

#### Draft Countdown Timer
- **Location**: Dashboard drafts section and blog submission page
- **Features**: Real-time countdown, expiry warnings, visual indicators
- **Props**: `draft` object with expiry information

#### Payment Retry Modal
- **Location**: Dashboard drafts section
- **Features**: Plan selection, countdown display, payment processing
- **Integration**: Lemon Squeezy checkout system

## User Experience Flow

### 1. Draft Creation
1. User starts writing a blog
2. System saves work as draft
3. Draft is marked with 7-day expiry

### 2. Payment Flow
1. User reaches review step
2. If premium required, draft is saved
3. User redirected to payment
4. After payment, draft is restored

### 3. Payment Failure Handling
1. User can return to drafts section
2. Retry payment button available
3. Countdown timer shows remaining time
4. User can complete payment before expiry

### 4. Draft Expiry
1. System automatically tracks time
2. Visual warnings when expiring soon
3. Automatic cleanup after 7 days
4. No external notifications sent

## Configuration

### Environment Variables
```bash
# Required for payment retry
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: Customize expiry period (default: 7 days)
DRAFT_EXPIRY_DAYS=7
```

### Cron Job Setup
```bash
# Run every 6 hours to clean up expired drafts
0 */6 * * * curl -X POST https://yourdomain.com/api/cron/cleanup-drafts
```

## Security Features

### User Isolation
- Users can only access their own drafts
- Draft IDs are validated as ObjectIds
- Session validation on all operations

### Payment Security
- Payment retry requires valid session
- Draft ownership verification
- Expiry validation before payment

### Data Protection
- Automatic cleanup prevents data accumulation
- No sensitive data in expired drafts
- Secure payment flow integration

## Monitoring and Maintenance

### Logging
- Draft creation and updates logged
- Payment retry attempts tracked
- Cleanup operations monitored

### Performance
- Efficient expiry calculations
- Optimized database queries
- Minimal impact on user experience

### Error Handling
- Graceful failure handling
- User-friendly error messages
- Fallback options for failed operations

## Future Enhancements

### Planned Features
- Draft versioning system
- Draft sharing between users
- Draft templates
- Bulk draft operations
- Advanced expiry notifications

### Scalability Considerations
- Database indexing for expiry queries
- Batch cleanup operations
- Rate limiting for payment retries
- Caching for draft metadata

## Troubleshooting

### Common Issues

#### Draft Not Loading
- Check user session validity
- Verify draft ownership
- Check database connectivity

#### Payment Retry Fails
- Verify draft expiry status
- Check payment gateway configuration
- Validate user permissions

#### Cleanup Not Working
- Check cron job configuration
- Verify API endpoint accessibility
- Monitor server logs for errors

### Debug Information
- Draft expiry calculations logged
- Payment retry attempts tracked
- Cleanup operation results recorded
- User interaction patterns monitored 