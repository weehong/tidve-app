/**
 * Rate History Management Module
 *
 * This module handles the storage and retrieval of historical exchange rates.
 * Every time the cron job fetches new rates from the external API, all rates
 * are stored in the history table, creating a complete audit trail.
 *
 * Benefits:
 * - Complete historical record of all exchange rates
 * - Ability to analyze rate trends over time
 * - Data for reporting and analytics
 * - Audit trail for compliance
 */

import { prisma } from "@/libs/prisma";

export type RateSnapshot = {
  code: string;
  rate: number;
};

export type RateHistoryRecord = {
  id: number;
  code: string;
  rate: number;
  source: string;
  createdAt: Date;
};

/**
 * Store a complete snapshot of all exchange rates
 *
 * @param rates - Object containing currency codes and their rates
 * @param source - Source of the rates (default: "cron")
 * @returns Number of records inserted
 */
export async function storeRateSnapshot(
  rates: Record<string, number>,
  source: string = "cron"
): Promise<number> {
  try {
    const rateRecords = Object.entries(rates).map(([code, rate]) => ({
      code,
      rate,
      source,
    }));

    // Batch insert all rates in a single transaction for performance
    const result = await prisma.rateHistory.createMany({
      data: rateRecords,
      skipDuplicates: false, // We want to store every snapshot
    });

    console.log(
      `[Rate History] Stored ${result.count} rates from source: ${source}`
    );

    return result.count;
  } catch (error) {
    console.error("[Rate History] Failed to store rate snapshot:", error);
    throw error;
  }
}

/**
 * Get the most recent rate snapshot for all currencies
 *
 * @returns Array of the latest rates for each currency
 */
export async function getLatestRateSnapshot(): Promise<RateHistoryRecord[]> {
  try {
    // Get the most recent timestamp
    const latest = await prisma.rateHistory.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (!latest) {
      return [];
    }

    // Get all rates from that timestamp
    const snapshot = await prisma.rateHistory.findMany({
      where: {
        createdAt: latest.createdAt,
      },
      orderBy: { code: "asc" },
    });

    return snapshot;
  } catch (error) {
    console.error("[Rate History] Failed to get latest snapshot:", error);
    throw error;
  }
}

/**
 * Get historical rates for a specific currency
 *
 * @param currencyCode - The currency code (e.g., "EUR", "GBP")
 * @param limit - Maximum number of records to return (default: 30)
 * @returns Array of historical rates for the currency
 */
export async function getCurrencyHistory(
  currencyCode: string,
  limit: number = 30
): Promise<RateHistoryRecord[]> {
  try {
    const history = await prisma.rateHistory.findMany({
      where: {
        code: currencyCode.toUpperCase(),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return history;
  } catch (error) {
    console.error(
      `[Rate History] Failed to get history for ${currencyCode}:`,
      error
    );
    throw error;
  }
}

/**
 * Get historical rates for a specific date range
 *
 * @param currencyCode - The currency code (e.g., "EUR", "GBP")
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @returns Array of historical rates within the date range
 */
export async function getCurrencyHistoryByDateRange(
  currencyCode: string,
  startDate: Date,
  endDate: Date
): Promise<RateHistoryRecord[]> {
  try {
    const history = await prisma.rateHistory.findMany({
      where: {
        code: currencyCode.toUpperCase(),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return history;
  } catch (error) {
    console.error(
      `[Rate History] Failed to get date range history for ${currencyCode}:`,
      error
    );
    throw error;
  }
}

/**
 * Get all unique snapshots (timestamps when rates were updated)
 *
 * @param limit - Maximum number of snapshots to return (default: 10)
 * @returns Array of unique timestamps with record counts
 */
export async function getRateSnapshots(limit: number = 10): Promise<
  Array<{
    timestamp: Date;
    count: number;
  }>
> {
  try {
    const snapshots = await prisma.$queryRaw<
      Array<{ created_at: Date; count: bigint }>
    >`
      SELECT
        created_at,
        COUNT(*) as count
      FROM rate_history
      GROUP BY created_at
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return snapshots.map((snapshot) => ({
      timestamp: snapshot.created_at,
      count: Number(snapshot.count),
    }));
  } catch (error) {
    console.error("[Rate History] Failed to get snapshots:", error);
    throw error;
  }
}

/**
 * Calculate statistics for a currency over time
 *
 * @param currencyCode - The currency code
 * @param days - Number of days to analyze (default: 30)
 * @returns Statistics object with min, max, avg, current
 */
export async function getCurrencyStatistics(
  currencyCode: string,
  days: number = 30
): Promise<{
  currency: string;
  current: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  recordCount: number;
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await prisma.rateHistory.aggregate({
      where: {
        code: currencyCode.toUpperCase(),
        createdAt: {
          gte: startDate,
        },
      },
      _min: { rate: true },
      _max: { rate: true },
      _avg: { rate: true },
      _count: true,
    });

    const latest = await prisma.rateHistory.findFirst({
      where: { code: currencyCode.toUpperCase() },
      orderBy: { createdAt: "desc" },
      select: { rate: true },
    });

    return {
      currency: currencyCode.toUpperCase(),
      current: latest?.rate || null,
      min: stats._min.rate,
      max: stats._max.rate,
      avg: stats._avg.rate,
      recordCount: stats._count,
    };
  } catch (error) {
    console.error(
      `[Rate History] Failed to get statistics for ${currencyCode}:`,
      error
    );
    throw error;
  }
}

/**
 * Clean up old rate history records
 *
 * @param daysToKeep - Number of days of history to retain (default: 365)
 * @returns Number of records deleted
 */
export async function cleanupOldRateHistory(
  daysToKeep: number = 365
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.rateHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(
      `[Rate History] Cleaned up ${result.count} records older than ${daysToKeep} days`
    );

    return result.count;
  } catch (error) {
    console.error("[Rate History] Failed to cleanup old records:", error);
    throw error;
  }
}
