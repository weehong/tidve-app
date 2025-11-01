# Subscription Renewal Enhancement - Migration Guide

## Overview

This document outlines the enhancements made to the subscription management module to support automatic date updates when subscription end dates are reached.

## What's New

### Features Implemented

1. **Automatic Date Rollover**: When `currentDate == endDate`, the subscription automatically updates:
   - `startDate` is set to the previous `endDate`
   - `newEndDate` is calculated based on the configured cycle type

2. **Multiple Cycle Types**:
   - **DAILY**: Renews every day
   - **MONTHLY**: Renews based on specified number of months (1, 3, 12, etc.)
   - **CUSTOM**: Renews based on custom number of days

3. **Data Integrity**:
   - Database transactions prevent data loss during updates
   - Comprehensive error handling and logging
   - No data duplication

4. **Enhanced Logging**:
   - Detailed logs for each successful renewal
   - Error tracking for failed renewals
   - Processing time metrics

5. **Comprehensive Test Coverage**:
   - 33 unit tests covering all edge cases
   - Date calculation logic for all cycle types
   - Month-end date handling (Feb 28/29, 30-day months)
   - Leap year support

## Database Schema Changes

### New Fields Added to `Subscription` Model

```prisma
cycleType       CycleType  @default(MONTHLY) @map("cycle_type")
cycleDays       Int?       @map("cycle_days")
```

### New Enum Type

```prisma
enum CycleType {
  DAILY
  MONTHLY
  CUSTOM
}
```

### New Index

```prisma
@@index([endDate])
```

## Migration Steps

### 1. Database Migration

Run the following command to apply the database schema changes:

```bash
# If using a production database, review the migration first
cat prisma/migrations/20251101153206_add_cycle_type_support/migration.sql

# Apply the migration
npx prisma migrate deploy
```

The migration will:
- Create the `CycleType` enum
- Add `cycle_type` column with default value `MONTHLY`
- Add `cycle_days` column (nullable)
- Create index on `end_date` for improved query performance

### 2. Update Existing Subscriptions

All existing subscriptions will automatically have `cycleType = 'MONTHLY'` (default value). If you need to update specific subscriptions to other cycle types, you can do so via the API or database directly.

Example SQL to update specific subscriptions:

```sql
-- Update a subscription to daily renewal
UPDATE subscriptions
SET cycle_type = 'DAILY'
WHERE id = 123;

-- Update a subscription to custom 14-day cycle
UPDATE subscriptions
SET cycle_type = 'CUSTOM', cycle_days = 14
WHERE id = 456;
```

### 3. Verify Cron Job Configuration

Ensure your cron job is properly configured to run daily. The cron job endpoint is:

```
GET /api/[cron]/subscription
```

**Vercel Cron Configuration** (vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/[cron]/subscription",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This runs daily at midnight UTC.

### 4. Update Environment Variables

Ensure `CRON_SECRET` is set in your environment variables for security.

## API Changes

### Create Subscription (POST /api/subscription)

**New Request Body Fields**:

```typescript
{
  name: string;
  currency: string;
  price: number;
  cycle: number;              // Required for MONTHLY type
  cycle_type?: "DAILY" | "MONTHLY" | "CUSTOM";  // Default: "MONTHLY"
  cycle_days?: number;        // Required for CUSTOM type
  start_date: string;         // ISO date string
  end_date: string;           // ISO date string
  url?: string;
}
```

**Examples**:

```javascript
// Daily subscription
{
  "name": "Daily Coffee",
  "currency": "USD",
  "price": 5.00,
  "cycle_type": "DAILY",
  "start_date": "2025-01-01",
  "end_date": "2025-01-02",
}

// Monthly subscription (existing behavior)
{
  "name": "Netflix",
  "currency": "USD",
  "price": 15.99,
  "cycle": 1,
  "cycle_type": "MONTHLY",
  "start_date": "2025-01-15",
  "end_date": "2025-02-15",
}

// Custom 7-day subscription
{
  "name": "Weekly Meal Kit",
  "currency": "USD",
  "price": 79.99,
  "cycle_type": "CUSTOM",
  "cycle_days": 7,
  "start_date": "2025-01-01",
  "end_date": "2025-01-08",
}
```

### Update Subscription (PUT /api/subscription/[id])

Same new fields as create.

### Get Subscriptions (GET /api/subscription)

**Response now includes**:

```typescript
{
  id: number;
  name: string;
  currency: string;
  price: number;
  cycleType: "DAILY" | "MONTHLY" | "CUSTOM";
  cycleInMonths: number;
  cycleDays: number | null;
  startDate: Date;
  endDate: Date;
  url: string | null;
}
```

## Cron Job Behavior

### Previous Behavior

- Checked for subscriptions where `endDate <= today`
- Updated only `endDate`
- Used `Promise.all()` for parallel updates

### New Behavior

- **Exact Date Matching**: Only renews when `currentDate == endDate` (normalized to midnight UTC)
- **Updates Both Dates**: Sets `startDate = previousEndDate` and calculates new `endDate`
- **Transaction Safety**: Each renewal wrapped in a database transaction
- **Enhanced Logging**: Detailed logs for each renewal with metrics

### Response Format

```json
{
  "success": true,
  "message": "2 subscription(s) renewed successfully",
  "data": [
    {
      "subscriptionId": 123,
      "subscriptionName": "Netflix",
      "userId": "auth0|123",
      "cycleType": "MONTHLY",
      "previousStartDate": "2024-12-15T00:00:00.000Z",
      "previousEndDate": "2025-01-15T00:00:00.000Z",
      "newStartDate": "2025-01-15T00:00:00.000Z",
      "newEndDate": "2025-02-15T00:00:00.000Z",
      "daysExtended": 31
    }
  ],
  "errors": [],
  "meta": {
    "renewedAt": "2025-01-15T00:00:01.234Z",
    "totalChecked": 50,
    "totalDueForRenewal": 2,
    "totalRenewed": 2,
    "totalFailed": 0,
    "processingTimeMs": 145
  }
}
```

## Date Calculation Logic

### DAILY Cycle

```javascript
newEndDate = currentEndDate + 1 day
```

### MONTHLY Cycle

```javascript
newEndDate = currentEndDate + cycleInMonths months
```

**Special Month-End Handling**:
- If `currentEndDate` is the last day of the month, `newEndDate` will also be the last day of its month
- Example: Jan 31 + 1 month = Feb 28 (or Feb 29 in leap years)
- Example: Jan 31 + 2 months = Mar 31

### CUSTOM Cycle

```javascript
if (cycleDays > 0) {
  newEndDate = currentEndDate + cycleDays days
} else {
  // Fallback to monthly if cycleDays not set
  newEndDate = currentEndDate + cycleInMonths months
}
```

## Testing

### Run Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Test Coverage

- ✅ Daily cycle calculations
- ✅ Monthly cycle calculations (1, 3, 12 months)
- ✅ Custom cycle calculations (7, 30, 90, 365 days)
- ✅ Month-end date edge cases
- ✅ Leap year handling
- ✅ February edge cases
- ✅ Exact vs inclusive date matching
- ✅ Log formatting

## Rollback Plan

If you need to rollback this update:

### 1. Revert Database Migration

```bash
# Check migration status
npx prisma migrate status

# Create a down migration
# Manual SQL to remove the new columns
```

Example rollback SQL:

```sql
-- Drop the new columns
ALTER TABLE subscriptions DROP COLUMN cycle_type;
ALTER TABLE subscriptions DROP COLUMN cycle_days;

-- Drop the enum type
DROP TYPE "CycleType";

-- Drop the index
DROP INDEX subscriptions_end_date_idx;
```

### 2. Revert Code Changes

```bash
git revert <commit-hash>
```

### 3. Redeploy Previous Version

Deploy the previous version of your application.

## Monitoring and Logging

### Log Format

Each successful renewal logs:

```
[SUBSCRIPTION RENEWAL] | ID: 123 | Name: Netflix | User: auth0|123 | Cycle: MONTHLY | Previous End: 2025-01-15T00:00:00.000Z | New End: 2025-02-15T00:00:00.000Z | Days Extended: 31 | Timestamp: 2025-01-15T00:00:01.234Z
```

### Metrics to Monitor

- **Success Rate**: `totalRenewed / totalDueForRenewal`
- **Error Rate**: `totalFailed / totalDueForRenewal`
- **Processing Time**: `processingTimeMs` should remain consistent
- **Total Checked**: Monitor for unexpected spikes

### Common Errors

1. **Database Connection Issues**:
   ```
   Failed to process subscription renewals
   ```
   Solution: Check database connection and credentials

2. **Invalid Cycle Configuration**:
   ```
   Unsupported cycle type
   ```
   Solution: Ensure `cycleType` is one of: DAILY, MONTHLY, CUSTOM

3. **Transaction Failures**:
   Individual subscription errors logged separately
   Solution: Check specific subscription data integrity

## Best Practices

### 1. Cycle Type Selection

- **DAILY**: Use for daily services (newspapers, daily access passes)
- **MONTHLY**: Use for standard subscriptions (streaming, SaaS, memberships)
- **CUSTOM**: Use for non-standard billing periods (bi-weekly, quarterly if not evenly divisible by months)

### 2. End Date Management

- Always set initial `endDate` correctly based on cycle type
- For month-end dates, use the last day of the month to maintain consistency

### 3. Testing Before Deployment

```bash
# Run all tests
npm run test:run

# Build the project
npm run build

# Test cron job locally (requires auth)
curl -X GET http://localhost:3000/api/[cron]/subscription \
  -H "Authorization: Bearer <cron-secret>"
```

## Support and Troubleshooting

### FAQ

**Q: What happens if a subscription is not renewed on its exact end date?**
A: With exact matching enabled (default), it will be skipped. The next cron run on the following day will not renew it. Consider using inclusive matching or manual intervention.

**Q: Can I change a subscription's cycle type after creation?**
A: Yes, use the PUT /api/subscription/[id] endpoint with the new cycle_type and related fields.

**Q: How do I handle pro-rated renewals?**
A: This system handles date-based renewals only. For pro-rated pricing, implement custom logic in your payment processing.

**Q: What time zone is used for renewals?**
A: All dates are normalized to UTC midnight for consistency.

### Performance Considerations

- The cron job uses database transactions, which may impact performance with thousands of subscriptions
- Consider batching renewals if you have >10,000 subscriptions renewing daily
- Monitor database connection pool usage during cron execution

## Related Files

### Core Implementation
- `/src/utils/subscription-renewal.ts` - Date calculation utilities
- `/src/app/api/[cron]/subscription/route.ts` - Cron job endpoint
- `/prisma/schema.prisma` - Database schema

### API Routes
- `/src/app/api/subscription/route.ts` - Create/List subscriptions
- `/src/app/api/subscription/[id]/route.ts` - Get/Update/Delete subscription

### Validation
- `/src/libs/validation/subscription.ts` - Form validation schema

### Types
- `/src/types/subscription.ts` - TypeScript type definitions

### Tests
- `/src/utils/__tests__/subscription-renewal.test.ts` - Unit tests (33 tests)

## Version History

- **v1.1.0** (2025-11-01): Added automatic renewal with multiple cycle types
- **v1.0.0** (2025-05-02): Initial subscription system

## License

Same as the main project.
