/**
 * Subscription Date Alignment Utilities
 *
 * Handles automatic alignment of subscription start and end dates
 * to standard billing periods (monthly, yearly).
 */

import { CycleType } from '@/types/subscription';

export interface AlignmentResult {
  id: number;
  name: string;
  userId: string;
  previousStartDate: Date;
  previousEndDate: Date;
  newStartDate: Date;
  newEndDate: Date;
  cycleType: CycleType;
  cycleInMonths: number;
  wasAligned: boolean;
}

export interface SubscriptionToAlign {
  id: number;
  name: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  cycleType: CycleType;
  cycleInMonths: number;
}

/**
 * Calculate aligned dates for a subscription based on its cycle
 *
 * @param subscription - The subscription to align
 * @param referenceDate - The reference date (defaults to current date)
 * @returns Object containing expected start and end dates, or null if alignment not needed
 */
export function calculateAlignedDates(
  subscription: SubscriptionToAlign,
  referenceDate: Date = new Date()
): { expectedStart: Date; expectedEnd: Date } | null {
  const { cycleType, cycleInMonths } = subscription;

  // Only process MONTHLY cycles
  if (cycleType !== CycleType.MONTHLY) {
    return null;
  }

  let expectedStart: Date;
  let expectedEnd: Date;

  if (cycleInMonths === 1) {
    // Monthly cycle: align to first day of current month through first day of next month
    expectedStart = getStartOfMonth(referenceDate);
    expectedEnd = addMonths(expectedStart, 1);
  } else if (cycleInMonths === 12) {
    // Yearly cycle: align to Jan 1 of current year through Jan 1 of next year
    expectedStart = getStartOfYear(referenceDate);
    expectedEnd = addYears(expectedStart, 1);
  } else {
    // Other cycles (quarterly, semi-annually, etc.) - not currently handled
    return null;
  }

  return { expectedStart, expectedEnd };
}

/**
 * Check if a subscription needs date alignment
 *
 * @param subscription - The subscription to check
 * @param referenceDate - The reference date (defaults to current date)
 * @returns True if alignment is needed
 */
export function needsAlignment(
  subscription: SubscriptionToAlign,
  referenceDate: Date = new Date()
): boolean {
  const alignedDates = calculateAlignedDates(subscription, referenceDate);

  if (!alignedDates) {
    return false; // No alignment needed for this cycle type
  }

  const { expectedStart, expectedEnd } = alignedDates;

  // Normalize dates to UTC midnight for comparison
  const currentStart = normalizeToUTCMidnight(subscription.startDate);
  const currentEnd = normalizeToUTCMidnight(subscription.endDate);
  const normalizedExpectedStart = normalizeToUTCMidnight(expectedStart);
  const normalizedExpectedEnd = normalizeToUTCMidnight(expectedEnd);

  // Check if dates are already aligned
  return (
    currentStart.getTime() !== normalizedExpectedStart.getTime() ||
    currentEnd.getTime() !== normalizedExpectedEnd.getTime()
  );
}

/**
 * Get alignment result for a subscription
 *
 * @param subscription - The subscription to align
 * @param referenceDate - The reference date (defaults to current date)
 * @returns Alignment result with old and new dates
 */
export function getAlignmentResult(
  subscription: SubscriptionToAlign,
  referenceDate: Date = new Date()
): AlignmentResult | null {
  const alignedDates = calculateAlignedDates(subscription, referenceDate);

  if (!alignedDates) {
    return null;
  }

  const { expectedStart, expectedEnd } = alignedDates;
  const wasAligned = needsAlignment(subscription, referenceDate);

  return {
    id: subscription.id,
    name: subscription.name,
    userId: subscription.userId,
    previousStartDate: subscription.startDate,
    previousEndDate: subscription.endDate,
    newStartDate: expectedStart,
    newEndDate: expectedEnd,
    cycleType: subscription.cycleType,
    cycleInMonths: subscription.cycleInMonths,
    wasAligned,
  };
}

/**
 * Format alignment log message
 */
export function formatAlignmentLog(
  subscriptionId: number,
  subscriptionName: string,
  userId: string,
  cycleType: CycleType,
  cycleInMonths: number,
  previousStartDate: Date,
  previousEndDate: Date,
  newStartDate: Date,
  newEndDate: Date,
  wasAligned: boolean
): string {
  const status = wasAligned ? 'ALIGNED' : 'ALREADY_ALIGNED';

  return [
    `[SUBSCRIPTION ALIGNMENT]`,
    `Status: ${status}`,
    `ID: ${subscriptionId}`,
    `Name: ${subscriptionName}`,
    `User: ${userId}`,
    `Cycle: ${cycleType}`,
    `Months: ${cycleInMonths}`,
    wasAligned
      ? `Previous: ${previousStartDate.toISOString()} → ${previousEndDate.toISOString()}`
      : '',
    wasAligned
      ? `New: ${newStartDate.toISOString()} → ${newEndDate.toISOString()}`
      : `Current: ${previousStartDate.toISOString()} → ${previousEndDate.toISOString()}`,
    `Timestamp: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join(' | ');
}

// ============================================================================
// Date Utility Functions
// ============================================================================

/**
 * Get the start of the month (first day at midnight UTC)
 */
function getStartOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

/**
 * Get the start of the year (Jan 1 at midnight UTC)
 */
function getStartOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
}

/**
 * Add months to a date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const targetMonth = date.getUTCMonth() + months;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonth / 12);
  const finalMonth = ((targetMonth % 12) + 12) % 12;

  result.setUTCFullYear(targetYear);
  result.setUTCMonth(finalMonth);

  return result;
}

/**
 * Add years to a date
 */
function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setUTCFullYear(date.getUTCFullYear() + years);
  return result;
}

/**
 * Normalize a date to UTC midnight
 */
function normalizeToUTCMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}
