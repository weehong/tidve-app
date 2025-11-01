/**
 * Unit Tests for Subscription Renewal Utilities
 *
 * Tests cover:
 * - Date calculation for different cycle types (DAILY, MONTHLY, CUSTOM)
 * - Edge cases (month-end dates, leap years, etc.)
 * - Renewal detection logic
 * - Logging formatters
 */

import { describe, it, expect } from 'vitest';
import {
  calculateNextRenewalDates,
  shouldRenewSubscription,
  formatRenewalLog,
} from '../subscription-renewal';
import { CycleType } from '@/types/subscription';

describe('calculateNextRenewalDates', () => {
  describe('DAILY cycle type', () => {
    it('should add 1 day for daily cycle', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.DAILY,
        1,
        null
      );

      expect(result.newStartDate).toEqual(new Date('2025-01-15'));
      expect(result.newEndDate).toEqual(new Date('2025-01-16'));
      expect(result.daysExtended).toBe(1);
    });

    it('should handle month boundary correctly', () => {
      const currentEndDate = new Date('2025-01-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.DAILY,
        1,
        null
      );

      expect(result.newEndDate).toEqual(new Date('2025-02-01'));
      expect(result.daysExtended).toBe(1);
    });

    it('should handle year boundary correctly', () => {
      const currentEndDate = new Date('2025-12-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.DAILY,
        1,
        null
      );

      expect(result.newEndDate).toEqual(new Date('2026-01-01'));
      expect(result.daysExtended).toBe(1);
    });
  });

  describe('MONTHLY cycle type', () => {
    it('should add 1 month for monthly cycle', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      expect(result.newStartDate).toEqual(new Date('2025-01-15'));
      expect(result.newEndDate).toEqual(new Date('2025-02-15'));
    });

    it('should add 3 months for quarterly cycle', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        3,
        null
      );

      expect(result.newEndDate).toEqual(new Date('2025-04-15'));
    });

    it('should add 12 months for yearly cycle', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        12,
        null
      );

      expect(result.newEndDate).toEqual(new Date('2026-01-15'));
    });

    it('should handle month-end dates correctly (31st to 28th Feb)', () => {
      const currentEndDate = new Date('2025-01-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // Jan 31 + 1 month should be Feb 28 (last day of Feb in non-leap year)
      expect(result.newEndDate).toEqual(new Date('2025-02-28'));
    });

    it('should handle month-end dates in leap year (31st to 29th Feb)', () => {
      const currentEndDate = new Date('2024-01-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // Jan 31 + 1 month in leap year should be Feb 29
      expect(result.newEndDate).toEqual(new Date('2024-02-29'));
    });

    it('should preserve last day of month (Jan 31 to Mar 31)', () => {
      const currentEndDate = new Date('2025-01-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        2,
        null
      );

      // Jan 31 + 2 months should be Mar 31 (both are last days)
      expect(result.newEndDate).toEqual(new Date('2025-03-31'));
    });

    it('should handle February to March correctly', () => {
      const currentEndDate = new Date('2025-02-28');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // Feb 28 (last day) + 1 month should be Mar 31 (last day)
      expect(result.newEndDate).toEqual(new Date('2025-03-31'));
    });

    it('should handle 30-day months correctly', () => {
      const currentEndDate = new Date('2025-03-31');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // Mar 31 (last day) + 1 month should be Apr 30 (last day)
      expect(result.newEndDate).toEqual(new Date('2025-04-30'));
    });

    it('should handle year boundary correctly', () => {
      const currentEndDate = new Date('2025-11-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        3,
        null
      );

      expect(result.newEndDate).toEqual(new Date('2026-02-15'));
    });
  });

  describe('CUSTOM cycle type', () => {
    it('should use cycleDays when provided', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        1,
        7 // 7 days custom cycle
      );

      expect(result.newEndDate).toEqual(new Date('2025-01-22'));
      expect(result.daysExtended).toBe(7);
    });

    it('should handle 30-day custom cycle', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        1,
        30
      );

      expect(result.newEndDate).toEqual(new Date('2025-02-14'));
      expect(result.daysExtended).toBe(30);
    });

    it('should handle 90-day custom cycle', () => {
      const currentEndDate = new Date('2025-01-01');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        1,
        90
      );

      expect(result.newEndDate).toEqual(new Date('2025-04-01'));
      expect(result.daysExtended).toBe(90);
    });

    it('should fallback to cycleInMonths when cycleDays is null', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        2,
        null
      );

      // Should use cycleInMonths as fallback
      expect(result.newEndDate).toEqual(new Date('2025-03-15'));
    });

    it('should fallback to cycleInMonths when cycleDays is 0', () => {
      const currentEndDate = new Date('2025-01-15');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        2,
        0
      );

      // Should use cycleInMonths as fallback
      expect(result.newEndDate).toEqual(new Date('2025-03-15'));
    });
  });

  describe('Edge cases', () => {
    it('should handle leap day correctly', () => {
      const currentEndDate = new Date('2024-02-29');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // Feb 29 (leap year, last day) + 1 month should be Mar 31 (last day)
      expect(result.newEndDate).toEqual(new Date('2024-03-31'));
    });

    it('should calculate correct days extended for monthly cycle', () => {
      const currentEndDate = new Date('2025-01-01');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.MONTHLY,
        1,
        null
      );

      // January has 31 days
      expect(result.daysExtended).toBe(31);
    });

    it('should handle large cycleDays values', () => {
      const currentEndDate = new Date('2025-01-01');
      const result = calculateNextRenewalDates(
        currentEndDate,
        CycleType.CUSTOM,
        1,
        365
      );

      expect(result.newEndDate).toEqual(new Date('2026-01-01'));
      expect(result.daysExtended).toBe(365);
    });
  });
});

describe('shouldRenewSubscription', () => {
  describe('Exact date matching', () => {
    it('should return true when dates match exactly', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-15T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, true)).toBe(true);
    });

    it('should return true when dates match at different times (normalized)', () => {
      const endDate = new Date('2025-01-15T10:30:00.000Z');
      const currentDate = new Date('2025-01-15T18:45:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, true)).toBe(true);
    });

    it('should return false when current date is before end date', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-14T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, true)).toBe(false);
    });

    it('should return false when current date is after end date', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-16T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, true)).toBe(false);
    });
  });

  describe('Inclusive date matching', () => {
    it('should return true when dates match exactly', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-15T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, false)).toBe(true);
    });

    it('should return true when current date is after end date', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-16T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, false)).toBe(true);
    });

    it('should return false when current date is before end date', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-14T00:00:00.000Z');

      expect(shouldRenewSubscription(endDate, currentDate, false)).toBe(false);
    });
  });

  describe('Default behavior', () => {
    it('should use exact matching by default', () => {
      const endDate = new Date('2025-01-15T00:00:00.000Z');
      const currentDate = new Date('2025-01-16T00:00:00.000Z');

      // Should use exact match by default
      expect(shouldRenewSubscription(endDate, currentDate)).toBe(false);
    });

    it('should use current date by default when not specified', () => {
      // Create a date that's definitely today in UTC
      const now = new Date();
      const today = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      ));

      const endDate = new Date(today);

      expect(shouldRenewSubscription(endDate)).toBe(true);
    });
  });
});

describe('formatRenewalLog', () => {
  it('should format renewal log with all required fields', () => {
    const log = formatRenewalLog(
      123,
      'Netflix',
      'user_123',
      new Date('2025-01-15T00:00:00.000Z'),
      new Date('2025-02-15T00:00:00.000Z'),
      CycleType.MONTHLY,
      31
    );

    expect(log).toContain('[SUBSCRIPTION RENEWAL]');
    expect(log).toContain('ID: 123');
    expect(log).toContain('Name: Netflix');
    expect(log).toContain('User: user_123');
    expect(log).toContain('Cycle: MONTHLY');
    expect(log).toContain('Previous End: 2025-01-15T00:00:00.000Z');
    expect(log).toContain('New End: 2025-02-15T00:00:00.000Z');
    expect(log).toContain('Days Extended: 31');
    expect(log).toContain('Timestamp:');
  });

  it('should handle DAILY cycle type', () => {
    const log = formatRenewalLog(
      1,
      'Test',
      'user_1',
      new Date('2025-01-15'),
      new Date('2025-01-16'),
      CycleType.DAILY,
      1
    );

    expect(log).toContain('Cycle: DAILY');
    expect(log).toContain('Days Extended: 1');
  });

  it('should handle CUSTOM cycle type', () => {
    const log = formatRenewalLog(
      1,
      'Test',
      'user_1',
      new Date('2025-01-15'),
      new Date('2025-01-22'),
      CycleType.CUSTOM,
      7
    );

    expect(log).toContain('Cycle: CUSTOM');
    expect(log).toContain('Days Extended: 7');
  });

  it('should format with pipe delimiters', () => {
    const log = formatRenewalLog(
      1,
      'Test',
      'user_1',
      new Date('2025-01-15'),
      new Date('2025-02-15'),
      CycleType.MONTHLY,
      31
    );

    const parts = log.split(' | ');
    expect(parts.length).toBeGreaterThan(1);
  });
});
