# Robust Voting Sync System

## Overview

This system addresses the critical issues with vote synchronization between the external voting API (Redis) and our local database (MongoDB). It prevents vote loss, handles timing conflicts, and provides recovery mechanisms.

## Critical Issues Solved

### 1. **Failed Flush = Lost Votes**
- **Problem**: If external flush fails, votes in Redis are lost permanently
- **Solution**: Create backup snapshot BEFORE any flush operations

### 2. **Late Collection = Vote Mixing**
- **Problem**: New votes for next launch period mix with old votes
- **Solution**: Precise timing control and backup isolation

### 3. **Instant New Voting**
- **Problem**: New voting begins immediately after launch ends
- **Solution**: Non-blocking flush operations with backup safety

## System Architecture

### **Multi-Phase Flush Process**

```
PHASE 1: Find apps needing finalization
PHASE 2: Create backup snapshot (BEFORE flush)
PHASE 3: Store backup in MongoDB
PHASE 4: Trigger external flush (non-blocking)
PHASE 5: Update local database with final counts
PHASE 6: Cleanup old backups
```

### **Backup Strategy**

- **Collection**: `vote_backups`
- **Retention**: 30 days
- **Structure**: 
  ```json
  {
    "appId": "string",
    "votes": "number",
    "backedUpAt": "Date",
    "launchDate": "Date",
    "originalLikes": "number"
  }
  ```

## API Endpoints

### **1. Finalize Votes** (`POST /api/launch/finalize`)
```json
{
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "updated": 5,
  "top3": ["app1", "app2", "app3"],
  "backupCreated": 5,
  "message": "Finalized 5 apps with vote backup"
}
```

### **2. Recover Votes** (`POST /api/launch/recover-votes`)
```json
{
  "date": "2024-01-15",
  "appIds": ["app1", "app2"] // optional
}
```

### **3. Health Check** (`GET /api/launch/vote-health?date=2024-01-15`)
```json
{
  "status": "healthy|issues_detected|error",
  "health": {
    "date": "2024-01-15",
    "totalLaunchedApps": 5,
    "finalizedApps": 5,
    "unflushedApps": 0,
    "backupRecords": 5,
    "issues": [],
    "recommendations": []
  }
}
```

## Safety Mechanisms

### **1. Backup Before Flush**
- Always create backup BEFORE triggering external flush
- If flush fails, we still have vote data

### **2. Non-Blocking Flush**
- External flush is triggered but doesn't block our process
- We continue with backup data regardless of flush success

### **3. Idempotent Operations**
- Only process apps where `votingFlushed: { $ne: true }`
- Safe to run multiple times

### **4. Data Consistency Checks**
- Health endpoint detects inconsistencies
- Recovery endpoint can fix data issues

## Usage Examples

### **Daily Finalization (Cron Job)**
```bash
# Run at 00:05 AM (5 minutes after launch day ends)
curl -X POST /api/launch/finalize \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15"}'
```

### **Health Monitoring (Daily Check)**
```bash
# Check health of previous day's finalization
curl /api/launch/vote-health?date=2024-01-15
```

### **Emergency Recovery**
```bash
# If votes are lost, recover from backup
curl -X POST /api/launch/recover-votes \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15"}'
```

## Error Handling

### **External API Failures**
- Log warning but continue with backup data
- Don't fail the entire finalization process

### **Database Errors**
- Comprehensive error logging
- Phase-specific error reporting
- Rollback capabilities through backups

### **Timing Issues**
- Only process unflushed apps
- Prevent duplicate processing
- Handle late finalization gracefully

## Monitoring & Alerts

### **Health Check Alerts**
- Monitor for unflushed apps
- Check backup data consistency
- Alert on vote count mismatches

### **Log Monitoring**
- Track finalization success rates
- Monitor backup creation
- Alert on external API failures

## Best Practices

### **1. Timing**
- Run finalization 5-10 minutes after launch day ends
- Allow buffer for any timezone issues

### **2. Monitoring**
- Check health endpoint daily
- Monitor for failed finalizations
- Set up alerts for data inconsistencies

### **3. Recovery**
- Keep backup data for 30 days minimum
- Test recovery process regularly
- Document any manual interventions

### **4. Testing**
- Test with small datasets first
- Verify backup creation
- Test recovery scenarios

## Troubleshooting

### **Common Issues**

1. **No apps finalized**
   - Check if apps have `votingFlushed: true`
   - Verify launch dates are correct

2. **Missing backup data**
   - Check if finalize process completed
   - Verify database permissions

3. **External API failures**
   - Check network connectivity
   - Verify API endpoint configuration
   - Review external API logs

4. **Vote count mismatches**
   - Run health check to identify issues
   - Use recovery endpoint if needed
   - Investigate timing issues

### **Emergency Procedures**

1. **Votes lost from external API**
   - Run recovery endpoint immediately
   - Verify backup data integrity
   - Check external API status

2. **Database corruption**
   - Restore from backup collection
   - Re-run finalization process
   - Verify data consistency

3. **Timing conflicts**
   - Check for overlapping launch periods
   - Verify timezone configurations
   - Review finalization schedule 