# Blog-Only Deployment Guide

This guide shows how to deploy your project with only the blog features visible to clients while you work on the launch system in the background.

## Quick Setup

### 1. Set Environment Variables in Vercel

In your Vercel dashboard, set these environment variables:

```
BLOG_DEPLOYMENT_COMPLETE=true
BLOG_CONTENT_ENABLED=true
APP_LAUNCH_ENABLED=false
VOTING_SYSTEM_ENABLED=false
LAUNCH_PAGE_ENABLED=false
PREMIUM_FEATURES_ENABLED=true
ADMIN_PANEL_ENABLED=true
MAINTENANCE_MODE=false
```

### 2. For Voting API Project

In your voting API Vercel project, set:

```
BLOG_DEPLOYMENT_COMPLETE=true
VOTING_SYSTEM_ENABLED=false
MAINTENANCE_MODE=false
```

## What Clients Will See

✅ **Available to Clients:**
- Blog content and navigation
- Home page
- Dashboard (for logged-in users)
- Pricing page
- Admin panel (for you to manage content)
- All blog-related features

❌ **Hidden from Clients:**
- "Tools" link in navigation
- Launch page (`/launch` returns "temporarily unavailable")
- Voting system
- App submission features
- Launch-related API endpoints

## What You Can Still Work On

- Launch system development
- Voting API improvements
- App submission flow
- All backend features
- Database management

## When Ready to Launch

Simply update these environment variables:

```
APP_LAUNCH_ENABLED=true
VOTING_SYSTEM_ENABLED=true
LAUNCH_PAGE_ENABLED=true
```

The "Tools" navigation link will appear and all launch features will become available.

## API Behavior

- `/api/launch/*` endpoints return 503 with deployment status
- Voting API endpoints return 503 with "voting system not available"
- Blog and user management APIs work normally

## Testing Locally

Create `.env.local` with:

```
BLOG_DEPLOYMENT_COMPLETE=true
BLOG_CONTENT_ENABLED=true
APP_LAUNCH_ENABLED=false
VOTING_SYSTEM_ENABLED=false
LAUNCH_PAGE_ENABLED=false
```

Run `npm run dev` to test blog-only mode locally.

## Benefits

1. **Deploy Now**: Get your blog live for clients immediately
2. **Work in Background**: Continue developing launch features without pressure
3. **Seamless Transition**: Enable launch features when ready with just environment variable changes
4. **No Code Changes**: All controlled through configuration
5. **Professional Experience**: Clients see polished blog content, not work-in-progress features
