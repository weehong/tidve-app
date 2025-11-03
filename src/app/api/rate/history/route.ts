import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";
import {
  getCurrencyHistory,
  getCurrencyHistoryByDateRange,
  getCurrencyStatistics,
  getLatestRateSnapshot,
  getRateSnapshots,
} from "@/utils/rate-history";

/**
 * GET /api/rate/history
 *
 * Query Parameters:
 * - currency: (optional) Currency code (e.g., "EUR", "GBP")
 * - limit: (optional) Number of records to return (default: 30)
 * - startDate: (optional) Start date for range query (ISO format)
 * - endDate: (optional) End date for range query (ISO format)
 * - action: (optional) "snapshots" | "statistics" | "latest"
 *
 * Examples:
 * - GET /api/rate/history?currency=EUR&limit=50
 * - GET /api/rate/history?currency=GBP&startDate=2025-01-01&endDate=2025-01-31
 * - GET /api/rate/history?action=latest
 * - GET /api/rate/history?action=snapshots&limit=10
 * - GET /api/rate/history?currency=EUR&action=statistics
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authentication check
    const session = await auth0.getSession();
    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency");
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const action = searchParams.get("action");

    // Handle different actions
    switch (action) {
      case "latest":
        // Get the latest complete snapshot of all rates
        const latestSnapshot = await getLatestRateSnapshot();
        return NextResponse.json({
          snapshot: latestSnapshot,
          count: latestSnapshot.length,
          timestamp: latestSnapshot[0]?.createdAt || null,
        });

      case "snapshots":
        // Get all snapshots (timestamps when rates were updated)
        const snapshots = await getRateSnapshots(limit);
        return NextResponse.json({
          snapshots,
          count: snapshots.length,
        });

      case "statistics":
        // Get statistics for a specific currency
        if (!currency) {
          return NextResponse.json(
            { error: "Currency parameter is required for statistics" },
            { status: 400 }
          );
        }
        const stats = await getCurrencyStatistics(currency, limit);
        return NextResponse.json(stats);

      default:
        // Get historical rates for a specific currency
        if (!currency) {
          return NextResponse.json(
            {
              error:
                "Currency parameter is required. Use action=latest or action=snapshots for all currencies",
            },
            { status: 400 }
          );
        }

        let history;
        if (startDate && endDate) {
          // Date range query
          const start = new Date(startDate);
          const end = new Date(endDate);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json(
              { error: "Invalid date format. Use ISO format (YYYY-MM-DD)" },
              { status: 400 }
            );
          }

          history = await getCurrencyHistoryByDateRange(currency, start, end);
        } else {
          // Standard query with limit
          history = await getCurrencyHistory(currency, limit);
        }

        return NextResponse.json({
          currency: currency.toUpperCase(),
          history,
          count: history.length,
        });
    }
  } catch (error) {
    console.error("[Rate History API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch rate history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
