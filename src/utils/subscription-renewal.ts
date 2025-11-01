/**
 * Subscription Renewal Utilities
 *
 * Handles automatic date calculation and renewal logic for subscriptions
 * with support for multiple cycle types (daily, monthly, custom).
 */

import { CycleType } from '@/types/subscription';

export interface RenewalCalculation {
  newStartDate: Date;
  newEndDate: Date;
  daysExtended: number;
}

/**
 * Calculate the next renewal dates for a subscription
 *
 * @param currentEndDate - The current end date of the subscription
 * @param cycleType - The type of billing cycle (DAILY, MONTHLY, CUSTOM)
 * @param cycleInMonths - Number of months for MONTHLY cycle
 * @param cycleDays - Number of days for DAILY or CUSTOM cycle
 * @returns Object containing new start date, end date, and days extended
 */
export function calculateNextRenewalDates(
  currentEndDate: Date,
  cycleType: CycleType,
  cycleInMonths: number,
  cycleDays?: number | null
): RenewalCalculation {
  // New start date is the current end date
  const newStartDate = new Date(currentEndDate);

  let newEndDate: Date;

  switch (cycleType) {
    case CycleType.DAILY:
      // For daily cycle, add 1 day
      newEndDate = addDays(currentEndDate, 1);
      break;

    case CycleType.MONTHLY:
      // For monthly cycle, add specified months
      newEndDate = addMonths(currentEndDate, cycleInMonths);
      break;

    case CycleType.CUSTOM:
      // For custom cycle, use cycleDays if provided, otherwise default to cycleInMonths
      if (cycleDays && cycleDays > 0) {
        newEndDate = addDays(currentEndDate, cycleDays);
      } else {
        // Fallback to monthly if cycleDays is not set
        newEndDate = addMonths(currentEndDate, cycleInMonths);
      }
      break;

    default:
      throw new Error(`Unsupported cycle type: ${cycleType}`);
  }

  // Calculate days extended
  const daysExtended = Math.ceil(
    (newEndDate.getTime() - currentEndDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    newStartDate,
    newEndDate,
    daysExtended
  };
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date with special handling for month-end dates
 */
function addMonths(date: Date, months: number): Date {
  const originalDay = date.getDate();

  // Get the last day of the original month
  const lastDayOfOriginalMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // Check if original date was the last day of the month
  const wasLastDayOfMonth = originalDay === lastDayOfOriginalMonth;

  // Calculate the target year and month
  const targetMonth = date.getMonth() + months;
  const targetYear = date.getFullYear() + Math.floor(targetMonth / 12);
  const finalMonth = ((targetMonth % 12) + 12) % 12;

  // Get the last day of the target month
  const lastDayOfTargetMonth = new Date(
    targetYear,
    finalMonth + 1,
    0
  ).getDate();

  // Determine the day for the result date
  let resultDay: number;
  if (wasLastDayOfMonth) {
    // If original was last day, new date should also be last day
    resultDay = lastDayOfTargetMonth;
  } else if (originalDay > lastDayOfTargetMonth) {
    // If original day doesn't exist in target month, use last day
    resultDay = lastDayOfTargetMonth;
  } else {
    // Use the original day
    resultDay = originalDay;
  }

  // Create the result date
  const result = new Date(targetYear, finalMonth, resultDay);

  // Preserve the time from the original date
  result.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

  return result;
}

/**
 * Check if a subscription should be renewed
 *
 * @param endDate - The subscription end date
 * @param currentDate - The current date (defaults to now)
 * @param exactMatch - If true, only renew when dates match exactly (default: true)
 * @returns True if subscription should be renewed
 */
export function shouldRenewSubscription(
  endDate: Date,
  currentDate: Date = new Date(),
  exactMatch: boolean = true
): boolean {
  // Normalize dates to UTC midnight for comparison
  const normalizedEndDate = new Date(Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate()
  ));

  const normalizedCurrentDate = new Date(Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate()
  ));

  if (exactMatch) {
    // Exact match: currentDate == endDate
    return normalizedCurrentDate.getTime() === normalizedEndDate.getTime();
  } else {
    // Inclusive match: currentDate >= endDate
    return normalizedCurrentDate.getTime() >= normalizedEndDate.getTime();
  }
}

/**
 * Format renewal log message
 */
export function formatRenewalLog(
  subscriptionId: number,
  subscriptionName: string,
  userId: string,
  previousEndDate: Date,
  newEndDate: Date,
  cycleType: CycleType,
  daysExtended: number
): string {
  return [
    `[SUBSCRIPTION RENEWAL]`,
    `ID: ${subscriptionId}`,
    `Name: ${subscriptionName}`,
    `User: ${userId}`,
    `Cycle: ${cycleType}`,
    `Previous End: ${previousEndDate.toISOString()}`,
    `New End: ${newEndDate.toISOString()}`,
    `Days Extended: ${daysExtended}`,
    `Timestamp: ${new Date().toISOString()}`
  ].join(' | ');
}
