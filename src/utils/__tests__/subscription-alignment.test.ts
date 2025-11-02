/**
 * Unit Tests for Subscription Alignment Utilities
 *
 * Tests cover:
 * - Aligned date calculation for monthly and yearly cycles
 * - Detection of misaligned subscriptions
 * - Edge cases (month boundaries, year boundaries)
 * - Logging formatters
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAlignedDates,
  needsAlignment,
  getAlignmentResult,
  formatAlignmentLog,
  type SubscriptionToAlign,
} from '../subscription-alignment';
import { CycleType } from '@/types/subscription';

describe('calculateAlignedDates', () => {
  describe('Monthly cycle (cycleInMonths = 1)', () => {
    it('should align to first day of month through first day of next month', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15T10:30:00.000Z'),
        endDate: new Date('2025-02-15T10:30:00.000Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-01-20T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result).not.toBeNull();
      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2025-02-01T00:00:00.000Z'));
    });

    it('should align correctly when reference date is at month boundary', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-01-01T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2025-02-01T00:00:00.000Z'));
    });

    it('should align correctly at year boundary (December)', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2026-01-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-12-20T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-12-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });

    it('should align correctly in February (non-leap year)', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-03-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-02-20T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-02-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2025-03-01T00:00:00.000Z'));
    });

    it('should align correctly in February (leap year)', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-03-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2024-02-20T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2024-02-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2024-03-01T00:00:00.000Z'));
    });
  });

  describe('Yearly cycle (cycleInMonths = 12)', () => {
    it('should align to Jan 1 of current year through Jan 1 of next year', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-06-15'),
        endDate: new Date('2026-06-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-07-01T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result).not.toBeNull();
      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });

    it('should align correctly at year start', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2026-03-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-01-01T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });

    it('should align correctly at year end', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-09-15'),
        endDate: new Date('2026-09-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-12-31T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });

    it('should align correctly across multiple years', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2025-06-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-03-15T00:00:00.000Z');
      const result = calculateAlignedDates(subscription, referenceDate);

      expect(result?.expectedStart).toEqual(new Date('2025-01-01T00:00:00.000Z'));
      expect(result?.expectedEnd).toEqual(new Date('2026-01-01T00:00:00.000Z'));
    });
  });

  describe('Unsupported cycle types', () => {
    it('should return null for DAILY cycle', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-16'),
        cycleType: CycleType.DAILY,
        cycleInMonths: 1,
      };

      const result = calculateAlignedDates(subscription);

      expect(result).toBeNull();
    });

    it('should return null for CUSTOM cycle', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-14'),
        cycleType: CycleType.CUSTOM,
        cycleInMonths: 1,
      };

      const result = calculateAlignedDates(subscription);

      expect(result).toBeNull();
    });

    it('should return null for quarterly cycle (3 months)', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-04-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 3,
      };

      const result = calculateAlignedDates(subscription);

      expect(result).toBeNull();
    });

    it('should return null for semi-annual cycle (6 months)', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-07-15'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 6,
      };

      const result = calculateAlignedDates(subscription);

      expect(result).toBeNull();
    });
  });
});

describe('needsAlignment', () => {
  describe('Monthly subscriptions', () => {
    it('should return true when dates are misaligned', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15T00:00:00.000Z'),
        endDate: new Date('2025-02-15T00:00:00.000Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-01-20T00:00:00.000Z');
      const result = needsAlignment(subscription, referenceDate);

      expect(result).toBe(true);
    });

    it('should return false when dates are already aligned', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-02-01T00:00:00.000Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-01-20T00:00:00.000Z');
      const result = needsAlignment(subscription, referenceDate);

      expect(result).toBe(false);
    });

    it('should ignore time components when checking alignment', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-01T10:30:45.123Z'),
        endDate: new Date('2025-02-01T18:45:30.789Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 1,
      };

      const referenceDate = new Date('2025-01-20T00:00:00.000Z');
      const result = needsAlignment(subscription, referenceDate);

      // Should be considered aligned because date portion matches
      expect(result).toBe(false);
    });
  });

  describe('Yearly subscriptions', () => {
    it('should return true when dates are misaligned', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-06-15T00:00:00.000Z'),
        endDate: new Date('2026-06-15T00:00:00.000Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-07-01T00:00:00.000Z');
      const result = needsAlignment(subscription, referenceDate);

      expect(result).toBe(true);
    });

    it('should return false when dates are already aligned', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2026-01-01T00:00:00.000Z'),
        cycleType: CycleType.MONTHLY,
        cycleInMonths: 12,
      };

      const referenceDate = new Date('2025-07-01T00:00:00.000Z');
      const result = needsAlignment(subscription, referenceDate);

      expect(result).toBe(false);
    });
  });

  describe('Unsupported cycle types', () => {
    it('should return false for DAILY cycle', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-16'),
        cycleType: CycleType.DAILY,
        cycleInMonths: 1,
      };

      expect(needsAlignment(subscription)).toBe(false);
    });

    it('should return false for CUSTOM cycle', () => {
      const subscription: SubscriptionToAlign = {
        id: 1,
        name: 'Test',
        userId: 'user_1',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-14'),
        cycleType: CycleType.CUSTOM,
        cycleInMonths: 1,
      };

      expect(needsAlignment(subscription)).toBe(false);
    });
  });
});

describe('getAlignmentResult', () => {
  it('should return alignment result with correct data for monthly cycle', () => {
    const subscription: SubscriptionToAlign = {
      id: 123,
      name: 'Netflix',
      userId: 'user_123',
      startDate: new Date('2025-01-15T00:00:00.000Z'),
      endDate: new Date('2025-02-15T00:00:00.000Z'),
      cycleType: CycleType.MONTHLY,
      cycleInMonths: 1,
    };

    const referenceDate = new Date('2025-01-20T00:00:00.000Z');
    const result = getAlignmentResult(subscription, referenceDate);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(123);
    expect(result?.name).toBe('Netflix');
    expect(result?.userId).toBe('user_123');
    expect(result?.previousStartDate).toEqual(new Date('2025-01-15T00:00:00.000Z'));
    expect(result?.previousEndDate).toEqual(new Date('2025-02-15T00:00:00.000Z'));
    expect(result?.newStartDate).toEqual(new Date('2025-01-01T00:00:00.000Z'));
    expect(result?.newEndDate).toEqual(new Date('2025-02-01T00:00:00.000Z'));
    expect(result?.cycleType).toBe(CycleType.MONTHLY);
    expect(result?.cycleInMonths).toBe(1);
    expect(result?.wasAligned).toBe(true);
  });

  it('should return alignment result with wasAligned=false when already aligned', () => {
    const subscription: SubscriptionToAlign = {
      id: 123,
      name: 'Netflix',
      userId: 'user_123',
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-02-01T00:00:00.000Z'),
      cycleType: CycleType.MONTHLY,
      cycleInMonths: 1,
    };

    const referenceDate = new Date('2025-01-20T00:00:00.000Z');
    const result = getAlignmentResult(subscription, referenceDate);

    expect(result).not.toBeNull();
    expect(result?.wasAligned).toBe(false);
  });

  it('should return null for unsupported cycle types', () => {
    const subscription: SubscriptionToAlign = {
      id: 123,
      name: 'Test',
      userId: 'user_123',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-16'),
      cycleType: CycleType.DAILY,
      cycleInMonths: 1,
    };

    const result = getAlignmentResult(subscription);

    expect(result).toBeNull();
  });
});

describe('formatAlignmentLog', () => {
  it('should format aligned subscription log with all required fields', () => {
    const log = formatAlignmentLog(
      123,
      'Netflix',
      'user_123',
      CycleType.MONTHLY,
      1,
      new Date('2025-01-15T00:00:00.000Z'),
      new Date('2025-02-15T00:00:00.000Z'),
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2025-02-01T00:00:00.000Z'),
      true
    );

    expect(log).toContain('[SUBSCRIPTION ALIGNMENT]');
    expect(log).toContain('Status: ALIGNED');
    expect(log).toContain('ID: 123');
    expect(log).toContain('Name: Netflix');
    expect(log).toContain('User: user_123');
    expect(log).toContain('Cycle: MONTHLY');
    expect(log).toContain('Months: 1');
    expect(log).toContain('Previous: 2025-01-15T00:00:00.000Z → 2025-02-15T00:00:00.000Z');
    expect(log).toContain('New: 2025-01-01T00:00:00.000Z → 2025-02-01T00:00:00.000Z');
    expect(log).toContain('Timestamp:');
  });

  it('should format already aligned subscription log correctly', () => {
    const log = formatAlignmentLog(
      123,
      'Netflix',
      'user_123',
      CycleType.MONTHLY,
      1,
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2025-02-01T00:00:00.000Z'),
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2025-02-01T00:00:00.000Z'),
      false
    );

    expect(log).toContain('Status: ALREADY_ALIGNED');
    expect(log).toContain('Current: 2025-01-01T00:00:00.000Z → 2025-02-01T00:00:00.000Z');
    expect(log).not.toContain('Previous:');
    expect(log).not.toContain('New:');
  });

  it('should handle yearly cycle (12 months)', () => {
    const log = formatAlignmentLog(
      456,
      'Annual Service',
      'user_456',
      CycleType.MONTHLY,
      12,
      new Date('2025-06-15T00:00:00.000Z'),
      new Date('2026-06-15T00:00:00.000Z'),
      new Date('2025-01-01T00:00:00.000Z'),
      new Date('2026-01-01T00:00:00.000Z'),
      true
    );

    expect(log).toContain('Months: 12');
    expect(log).toContain('Previous: 2025-06-15T00:00:00.000Z → 2026-06-15T00:00:00.000Z');
    expect(log).toContain('New: 2025-01-01T00:00:00.000Z → 2026-01-01T00:00:00.000Z');
  });

  it('should format with pipe delimiters', () => {
    const log = formatAlignmentLog(
      1,
      'Test',
      'user_1',
      CycleType.MONTHLY,
      1,
      new Date('2025-01-15'),
      new Date('2025-02-15'),
      new Date('2025-01-01'),
      new Date('2025-02-01'),
      true
    );

    const parts = log.split(' | ');
    expect(parts.length).toBeGreaterThan(1);
  });
});
