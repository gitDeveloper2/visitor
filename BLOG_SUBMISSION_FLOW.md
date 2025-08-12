# Blog Submission Flow with Premium Support

## Overview
This document describes the improved blog submission flow that properly handles premium subscriptions without losing user data.

## How It Works

### 1. Founder Stories (Free)
- Users can submit founder stories without any premium requirement
- These are marked with `isFounderStory: true`
- No payment flow involved

### 2. Premium Blog Submissions
- Users can start writing any type of blog
- When they reach the review step, if it's not a founder story, premium is required
- The system saves their work as a draft before redirecting to payment
- After successful payment, users return to complete their submission

## Flow Steps

### Step 1: Blog Information
- User fills out basic blog details
- Can toggle "Founder Story" option

### Step 2: Write Blog
- User writes their blog content
- All data is stored in local state

### Step 3: Review & Submit
- **If Founder Story**: User can submit immediately
- **If Not Founder Story**: 
  - Premium subscription required
  - Draft is saved to database
  - User is redirected to payment
  - After payment, user returns with draft restored

## Technical Implementation

### Draft Management
- Drafts are stored in `blog_drafts` collection
- Each draft has a unique ID passed through the payment flow
- Drafts are automatically cleaned up after 7 days if unused

### Premium Validation
- Frontend checks premium status on load
- Backend double-checks premium access before submission
- Premium status is checked against `blog_premium_access` collection

### Payment Integration
- Uses Lemon Squeezy for payment processing
- Custom data includes draft ID and return URL
- Webhook processes successful payments and marks drafts as premium-ready

## API Endpoints

### `/api/user-blogs/draft`
- `POST`: Save a new draft
- `DELETE`: Clean up old drafts

### `/api/user-blogs/draft/[id]`
- `GET`: Retrieve a specific draft
- `DELETE`: Delete a specific draft

### `/api/user-blogs/check-premium`
- `GET`: Check if user has active premium access

## Database Collections

### `blog_drafts`
- Stores temporary blog drafts
- Fields: title, content, tags, author info, userId, timestamps, premiumReady

### `blog_premium_access`
- Stores active premium subscriptions
- Fields: userId, subscriptionId, status, plan, expiresAt, timestamps

### `userblogs`
- Stores published blog posts
- Fields: title, slug, content, tags, author info, status, timestamps

## Error Handling

- Draft save failures are logged and user is notified
- Payment failures preserve draft data
- Network errors during draft restoration show helpful messages
- Premium validation failures prevent submission

## Security Features

- Drafts are user-scoped (users can only access their own drafts)
- Premium validation happens on both frontend and backend
- Draft IDs are validated as ObjectIds
- Session validation on all draft operations

## Future Enhancements

- Draft auto-save during writing
- Draft versioning
- Draft sharing between users
- Draft templates
- Bulk draft operations 