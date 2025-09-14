# Voting System Deployment Guide

## Overview
The voting system is now fully integrated with Redis-based session management, automatic vote flushing, and launch page integration.

## Environment Variables Required

### Production Environment
```bash
# Redis Configuration
REDIS_URL=redis://your-redis-instance:6379

# Cron Job Security
CRON_SECRET=your-secure-random-string

# Database (already configured)
MONGODB_URI=your-mongodb-connection-string

# Authentication (already configured)
AUTH_SECRET=your-auth-secret
```

### Vercel Environment Variables
Set these in your Vercel dashboard:
- `REDIS_URL` - Your Redis instance URL (Upstash recommended)
- `CRON_SECRET` - Secure random string for cron job authentication

## Deployment Checklist

### 1. Redis Setup
- [ ] Provision Redis instance (Upstash Redis recommended for Vercel)
- [ ] Configure `REDIS_URL` environment variable
- [ ] Test Redis connection

### 2. Environment Configuration
- [ ] Set `CRON_SECRET` environment variable
- [ ] Verify all existing environment variables are present
- [ ] Test environment variable access in production

### 3. Cron Job Configuration
- [ ] Verify `vercel.json` includes the manage-voting cron job
- [ ] Confirm cron schedule: `"0 10 * * *"` (10:00 UTC daily)
- [ ] Test cron job endpoint manually with proper authorization

### 4. Database Schema
- [ ] Ensure `userapps` collection exists
- [ ] Verify required fields: `stats.votes`, `stats.totalVotes`, `votingEnded`, `lastVoteFlush`
- [ ] Test vote flushing to MongoDB

### 5. Launch Page Integration
- [ ] Test voting session display
- [ ] Verify vote counts show correctly
- [ ] Test voting/unvoting functionality
- [ ] Confirm voting end time display

## Testing Guide

### Manual Testing Steps

#### 1. Vote Casting
1. Navigate to `/launch` page
2. Sign in with valid account
3. Find tools in "Launching Today" section
4. Click vote button - should increment count
5. Click again - should decrement count
6. Verify vote persistence on page reload

#### 2. Session Management
1. Manually trigger cron job: `GET /api/cron/manage-voting`
2. Include header: `Authorization: Bearer YOUR_CRON_SECRET`
3. Verify response includes session details
4. Check Redis for active session keys
5. Verify tools are properly associated with session

#### 3. Vote Flushing
1. Create test voting session with tools
2. Cast some votes
3. End session manually or wait for cron
4. Verify votes are flushed to MongoDB
5. Check that Redis keys are cleaned up

### API Endpoints for Testing

#### Vote Endpoint
```bash
POST /api/vote
Content-Type: application/json
Authorization: Bearer <user-session-token>

{
  "toolId": "tool-id-here"
}
```

#### Cron Management
```bash
GET /api/cron/manage-voting
Authorization: Bearer <CRON_SECRET>
```

## Monitoring

### Key Metrics to Monitor
- Vote casting success rate
- Cron job execution success
- Redis connection health
- Vote flush completion
- Session creation/cleanup

### Redis Keys to Monitor
- `voting:session:YYYY-MM-DD` - Active session data
- `voting:tools:YYYY-MM-DD` - Active tools set
- `voting:votes:tool-id` - Vote counts per tool
- `voting:user:user-id:YYYY-MM-DD` - User votes per day

## Troubleshooting

### Common Issues

#### Votes Not Counting
- Check Redis connection
- Verify user authentication
- Confirm tool is in active session
- Check API endpoint logs

#### Cron Job Failures
- Verify `CRON_SECRET` is set correctly
- Check authorization header format
- Monitor cron job logs in Vercel
- Ensure Redis and MongoDB connections are stable

#### Session Management Issues
- Check Redis key expiration settings
- Verify date formatting in session keys
- Monitor session creation/cleanup logs

### Debug Commands

#### Check Active Session
```javascript
// In Redis CLI or code
GET voting:session:2024-01-15
SMEMBERS voting:tools:2024-01-15
```

#### Check Vote Counts
```javascript
// Get vote count for a tool
GET voting:votes:tool-id-here

// Get user votes for today
SMEMBERS voting:user:user-id:2024-01-15
```

## Performance Considerations

### Redis Optimization
- Use connection pooling
- Set appropriate TTL values
- Monitor memory usage
- Use Redis pipelining for bulk operations

### Database Optimization
- Index on `launchDate` field
- Index on `status` field
- Monitor bulk write performance

## Security Notes

### Cron Job Security
- `CRON_SECRET` should be a strong random string
- Only Vercel cron jobs should access the endpoint
- Monitor for unauthorized access attempts

### Vote Integrity
- Redis atomic operations prevent race conditions
- User vote tracking prevents multiple votes per tool
- Session validation ensures votes only count during active periods

## Rollback Plan

If issues occur after deployment:

1. **Disable Voting**: Set `VOTING_SYSTEM_ENABLED=false` in environment
2. **Stop Cron Jobs**: Remove cron configuration from `vercel.json`
3. **Preserve Data**: Keep Redis and MongoDB data for investigation
4. **Fallback Display**: Launch page will show static vote counts from MongoDB

## Post-Deployment Verification

- [ ] Verify voting buttons appear on launch page
- [ ] Test vote casting with authenticated user
- [ ] Confirm cron job runs successfully
- [ ] Monitor Redis and MongoDB for proper data flow
- [ ] Check error logs for any issues
- [ ] Verify vote counts persist after session ends
