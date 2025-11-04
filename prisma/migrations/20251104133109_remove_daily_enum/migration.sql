-- Migration: Remove DAILY enum and consolidate to CUSTOM
-- This migration converts all DAILY subscriptions to CUSTOM with cycleDays = 1

-- Step 1: Update all DAILY subscriptions to CUSTOM with cycleDays = 1
UPDATE subscriptions
SET
  cycle_type = 'CUSTOM',
  cycle_days = 1
WHERE cycle_type = 'DAILY';

-- Step 2: Make cycle_days NOT NULL since all cycle types now require it
-- First, set default value for any NULL cycle_days in CUSTOM subscriptions
UPDATE subscriptions
SET cycle_days = COALESCE(cycle_days, cycle_in_months * 30)
WHERE cycle_type = 'CUSTOM' AND cycle_days IS NULL;

-- Step 3: Create new enum without DAILY
CREATE TYPE "CycleType_new" AS ENUM ('MONTHLY', 'CUSTOM');

-- Step 4: Update the column to use the new enum
ALTER TABLE subscriptions
  ALTER COLUMN cycle_type TYPE "CycleType_new"
  USING (cycle_type::text::"CycleType_new");

-- Step 5: Drop the old enum and rename the new one
DROP TYPE "CycleType";
ALTER TYPE "CycleType_new" RENAME TO "CycleType";

-- Step 6: Make cycle_days NOT NULL for CUSTOM type
-- (We'll enforce this at the application level for CUSTOM, keep it nullable for MONTHLY)
-- Actually, let's keep it nullable but ensure CUSTOM always has a value via validation
