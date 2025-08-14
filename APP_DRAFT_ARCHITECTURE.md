# App Draft & Retry Payment Architecture

## Overview
This document describes the new app draft and retry payment system that mirrors the successful blog draft architecture. This system allows users to save their app submissions as drafts and retry payments if they fail, preventing loss of user work.

## Architecture Components

### 1. Database Collections

#### `app_drafts` Collection
```typescript
interface AppDraft {
  _id: ObjectId;
  userId: string;
  name: string;
  description: string;
  tagline?: string;
  tags: string[];
  category?: string;
  techStack: string[];
  pricing: string;
  features: string[];
  website?: string;
  github?: string;
  authorBio?: string;
  premiumPlan?: string;
  premiumReady: boolean;
  status: 'draft';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. API Endpoints

#### `/api/user-apps/draft` (POST)
- **Purpose**: Save app submission as draft
- **Authentication**: Required
- **Validation**: Name and description required
- **Response**: `{ message: string, draftId: string }`

#### `/api/user-apps/drafts` (GET)
- **Purpose**: Fetch user's app drafts with expiry information
- **Authentication**: Required
- **Response**: `{ drafts: AppDraft[] }` with calculated expiry data

#### `/api/user-apps/draft/[id]` (GET)
- **Purpose**: Retrieve specific app draft for editing
- **Authentication**: Required
- **Validation**: Draft must belong to user

#### `/api/user-apps/draft/[id]` (DELETE)
- **Purpose**: Delete specific app draft
- **Authentication**: Required
- **Validation**: Draft must belong to user

#### `/api/user-apps/draft/[id]/retry-payment` (POST)
- **Purpose**: Retry payment for premium app draft
- **Authentication**: Required
- **Body**: `{ variantId: string }`
- **Response**: `{ checkoutUrl: string }`

### 3. Frontend Components

#### `AppDraftManager` Component
- **Location**: `src/components/premium/AppDraftManager.tsx`
- **Features**:
  - Display app drafts with expiry information
  - Visual status indicators (active, expiring soon, expired)
  - Retry payment functionality
  - Edit and delete draft actions
  - Real-time countdown timers

## User Experience Flow

### 1. App Creation with Draft Support
```
User starts app submission → Fills out form → Selects premium plan → 
System saves as draft → Redirects to payment → Payment fails → 
User returns to drafts → Can retry payment or edit draft
```

### 2. Draft Management
```
Draft created → 7-day countdown starts → User can edit/retry payment → 
Payment succeeds → Draft converted to app → Draft deleted
```

### 3. Payment Retry Flow
```
User clicks "Retry Payment" → API creates new checkout → 
Lemon Squeezy checkout → Payment success → Return to app submission → 
Draft restored and premium activated
```

## Technical Implementation Details

### 1. Draft Expiry System
- **7-Day Limit**: All drafts automatically expire after 7 days
- **Auto-Cleanup**: Expired drafts are automatically removed
- **Visual Indicators**: Color-coded borders (green/yellow/red)
- **Countdown Timer**: Shows remaining time in days

### 2. Payment Integration
- **Lemon Squeezy**: Direct checkout creation
- **Custom Payload**: Includes draft ID and return URL
- **Webhook Support**: Premium status activation via webhook
- **Return Flow**: Seamless return to app submission

### 3. Security Features
- **User Isolation**: Users can only access their own drafts
- **Session Validation**: All operations require authentication
- **ObjectId Validation**: Prevents injection attacks
- **Premium Verification**: Payment verification before activation

## Integration with Existing Systems

### 1. App Submission Page
The existing app submission page (`/dashboard/submission/app`) should be updated to:
- Save drafts before payment redirect
- Handle draft restoration after payment success
- Integrate with the new draft system

### 2. Dashboard Integration
Add the `AppDraftManager` component to the dashboard to show:
- Active app drafts
- Expiry information
- Payment retry options

### 3. Webhook System
Update the existing Lemon Squeezy webhook to handle:
- App draft premium activation
- Draft status updates
- Premium status verification

## Environment Variables Required

```bash
# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id

# App Premium Product
NEXT_PUBLIC_LEMON_SQUEEZY_APP_LISTING_VARIANT_ID=your_variant_id

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Cron Job Setup

### Automatic Draft Cleanup
```bash
# Run every 6 hours to clean up expired drafts
0 */6 * * * curl -X POST https://yourdomain.com/api/cron/cleanup-drafts
```

The cleanup endpoint now handles both blog and app drafts:
- `blog_drafts` collection cleanup
- `app_drafts` collection cleanup
- Combined reporting of deleted counts

## Benefits of This Architecture

### 1. User Experience
- **No Lost Work**: Failed payments don't lose user submissions
- **Flexible Payment**: Users can retry payments at their convenience
- **Clear Status**: Visual indicators show draft status and expiry
- **Seamless Flow**: Smooth transition from draft to published app

### 2. Business Benefits
- **Higher Conversion**: Users can complete payments later
- **Reduced Support**: Fewer "lost submission" support requests
- **Better Analytics**: Track draft-to-published conversion rates
- **Premium Revenue**: More opportunities for premium conversions

### 3. Technical Benefits
- **Consistent Architecture**: Mirrors successful blog system
- **Scalable Design**: Easy to extend to other content types
- **Maintainable Code**: Reusable components and patterns
- **Security First**: Proper authentication and validation

## Future Enhancements

### 1. Draft Auto-Save
- Real-time saving during form input
- Version history for drafts
- Conflict resolution for concurrent edits

### 2. Enhanced Notifications
- Email reminders for expiring drafts
- Push notifications for payment retry
- SMS alerts for critical actions

### 3. Advanced Analytics
- Draft conversion funnel analysis
- Payment retry success rates
- User behavior patterns

## Troubleshooting

### Common Issues

#### 1. Draft Not Saving
- Check user authentication
- Verify required fields (name, description)
- Check database connection

#### 2. Payment Retry Fails
- Verify Lemon Squeezy configuration
- Check variant ID configuration
- Validate draft expiry status

#### 3. Drafts Not Loading
- Check user session
- Verify database permissions
- Check API endpoint configuration

### Debug Logging
All endpoints include comprehensive logging:
- User authentication status
- Request/response data
- Error details and stack traces
- Performance metrics

## Conclusion

This app draft and retry payment architecture provides a robust, user-friendly system that prevents data loss and improves conversion rates. By mirroring the successful blog draft system, it maintains consistency while adding powerful new capabilities for app submissions.

The system is designed to be secure, scalable, and maintainable, with clear separation of concerns and comprehensive error handling. Users can now confidently start app submissions knowing their work is safe, even if payment fails initially. 