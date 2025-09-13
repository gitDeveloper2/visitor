# Deployment Flags System

This system allows you to control the deployment order so the blog deploys first and the app launches later, preventing any issues with the dual architecture setup.

## How It Works

The deployment flags system uses environment variables to control when different parts of the application become available:

### 1. Blog Deployment Phase
- `BLOG_DEPLOYMENT_COMPLETE=false` - Blog is being deployed
- `APP_LAUNCH_ENABLED=false` - App launch features disabled
- `VOTING_SYSTEM_ENABLED=false` - Voting system disabled

### 2. Blog Ready Phase  
- `BLOG_DEPLOYMENT_COMPLETE=true` - Blog deployment complete
- `APP_LAUNCH_ENABLED=false` - App launch still disabled
- Users can access blog content but launch features show "coming soon" message

### 3. Full Launch Phase
- `BLOG_DEPLOYMENT_COMPLETE=true` - Blog ready
- `APP_LAUNCH_ENABLED=true` - App launch enabled
- `VOTING_SYSTEM_ENABLED=true` - Voting system active
- `LAUNCH_PAGE_ENABLED=true` - Launch page accessible

## Environment Variables

### Main App (vercel.json)
```json
{
  "env": {
    "BLOG_DEPLOYMENT_COMPLETE": "@blog_deployment_complete",
    "APP_LAUNCH_ENABLED": "@app_launch_enabled", 
    "VOTING_SYSTEM_ENABLED": "@voting_system_enabled",
    "LAUNCH_PAGE_ENABLED": "@launch_page_enabled",
    "MAINTENANCE_MODE": "@maintenance_mode",
    "MAINTENANCE_BANNER": "@maintenance_banner"
  }
}
```

### Voting API (voting-api-main/vercel.json)
```json
{
  "env": {
    "BLOG_DEPLOYMENT_COMPLETE": "@blog_deployment_complete",
    "VOTING_SYSTEM_ENABLED": "@voting_system_enabled",
    "MAINTENANCE_MODE": "@maintenance_mode"
  }
}
```

## Deployment Sequence

### Step 1: Deploy Blog First
Set these environment variables in Vercel:
```
BLOG_DEPLOYMENT_COMPLETE=false
APP_LAUNCH_ENABLED=false
VOTING_SYSTEM_ENABLED=false
LAUNCH_PAGE_ENABLED=false
```

Deploy the main app. Users will see:
- Blog content works normally
- Launch page shows "temporarily unavailable" message
- API endpoints return 503 with deployment status

### Step 2: Blog Ready
Once blog deployment is stable, update:
```
BLOG_DEPLOYMENT_COMPLETE=true
APP_LAUNCH_ENABLED=false
VOTING_SYSTEM_ENABLED=false
LAUNCH_PAGE_ENABLED=false
```

Users will see:
- Blog fully functional
- Launch page shows "preparing to come online" message
- Status banner indicates blog is ready, app launch pending

### Step 3: Enable App Launch
When ready for full launch:
```
BLOG_DEPLOYMENT_COMPLETE=true
APP_LAUNCH_ENABLED=true
VOTING_SYSTEM_ENABLED=true
LAUNCH_PAGE_ENABLED=true
```

Users will see:
- All systems operational
- Launch page fully functional
- Voting system active
- Status banner shows "fully operational" or disappears

## Features Added

### 1. DeploymentFlagService (`src/utils/deploymentFlags.ts`)
- Centralized flag management
- Phase detection
- Status messages
- Middleware for API protection

### 2. DeploymentStatusBanner (`src/components/DeploymentStatusBanner.tsx`)
- Visual status indicator
- Phase-appropriate messaging
- Auto-hides when fully operational

### 3. Protected Endpoints
- `/api/launch/today` - Requires `appLaunchEnabled`
- `/api/flush-expired-votes` - Requires `votingSystemEnabled` and `blogDeploymentComplete`
- Launch page - Requires `launchPageEnabled`

### 4. Maintenance Mode
Set `MAINTENANCE_MODE=true` to show maintenance message across all systems.

## Testing

You can test the deployment phases locally by setting environment variables in `.env.local`:

```bash
# Test blog-only phase
BLOG_DEPLOYMENT_COMPLETE=false

# Test blog-ready phase  
BLOG_DEPLOYMENT_COMPLETE=true
APP_LAUNCH_ENABLED=false

# Test full operational phase
BLOG_DEPLOYMENT_COMPLETE=true
APP_LAUNCH_ENABLED=true
VOTING_SYSTEM_ENABLED=true
LAUNCH_PAGE_ENABLED=true
```

## Benefits

1. **Controlled Rollout**: Deploy blog first, then enable app features
2. **Dual Architecture Support**: Coordinates between main app and voting API
3. **User Communication**: Clear status messages during deployment phases
4. **Maintenance Mode**: Easy way to show maintenance messages
5. **API Protection**: Prevents errors when systems aren't ready
6. **Visual Feedback**: Status banners keep users informed
