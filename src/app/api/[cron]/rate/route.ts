import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { getExternalExchangeRates } from "@/libs/api/rate";
import { isVercelCron } from "@/libs/helper/check-cron-header";
import { storeRateSnapshot } from "@/utils/rate-history";

const prisma = new PrismaClient();

type UpdatedRate = {
  code: string;
  previousRate: number | null;
  newRate: number;
};

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: { params: Promise<{ cron: string }> }
): Promise<NextResponse> {
  if (!isVercelCron(request)) {
    console.error("[Rate Update] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Rate Update] Starting currency rate update");

  try {
    const currencies = await getExternalExchangeRates();
    if (!currencies?.rates) {
      return NextResponse.json(
        { error: "Failed to fetch currencies from external API" },
        { status: 500 },
      );
    }

    // STEP 1: Store complete snapshot in history
    // This stores ALL rates from the external API, creating a complete historical record
    const historyCount = await storeRateSnapshot(currencies.rates, "cron");
    console.log(`[Rate Update] Stored ${historyCount} rates in history`);

    const existingRates = await prisma.rate.findMany({
      select: { code: true, rate: true },
    });
    const existingRatesMap = new Map(
      existingRates.map((rate) => [rate.code, rate.rate]),
    );

    const updates: UpdatedRate[] = [];
    for (const [code, newRate] of Object.entries(currencies.rates)) {
      const previousRate = existingRatesMap.get(code);

      /**
       * Conservative Budgeting Strategy: Keep the HIGHEST rate
       *
       * Why? For expense tracking, using the highest historical rate provides:
       * 1. Conservative budgeting - never underestimate costs
       * 2. Safety margin - protect against currency fluctuations
       * 3. Pleasant surprises - when rates favor you, you save vs budget
       *
       * Example: €100 subscription
       * - Highest rate (1.10): Budget $110
       * - Current rate drops to 1.05: Actual cost $105 (saved $5!)
       * - Current rate rises to 1.08: Actual cost $108 (still within budget)
       *
       * This ensures users never face unexpected higher expenses.
       */
      if (!previousRate || newRate > previousRate) {
        updates.push({
          code,
          previousRate: previousRate || null,
          newRate,
        });
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(
        updates.map(({ code, newRate }) =>
          prisma.rate.upsert({
            where: { code },
            update: { rate: newRate },
            create: { code, rate: newRate },
          }),
        ),
      );
    }

    return NextResponse.json({
      message: `${updates.length} rate(s) updated, ${historyCount} stored in history`,
      summary: {
        ratesUpdated: updates.length,
        ratesInHistory: historyCount,
        timestamp: new Date().toISOString(),
      },
      updates: updates.map((update) => ({
        code: update.code,
        previousRate: update.previousRate,
        newRate: update.newRate,
        change: update.previousRate
          ? (
              ((update.newRate - update.previousRate) / update.previousRate) *
              100
            ).toFixed(2) + "%"
          : "New Rate",
      })),
    });
  } catch (error) {
    console.error("Currency update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update currencies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
