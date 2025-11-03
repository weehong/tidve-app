import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { isVercelCron } from "@/libs/helper/check-cron-header";
import {
  calculateNextRenewalDates,
  shouldRenewSubscription,
  formatRenewalLog,
} from "@/utils/subscription-renewal";
import { CycleType } from "@/types/subscription";

const prisma = new PrismaClient();

type UpdatedSubscription = {
  id: number;
  name: string;
  userId: string;
  previousStartDate: Date;
  previousEndDate: Date;
  newStartDate: Date;
  newEndDate: Date;
  cycleType: CycleType;
  cycleInMonths: number;
  cycleDays: number | null;
  daysExtended: number;
};

type RenewalError = {
  id: number;
  name: string;
  error: string;
};

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: { params: Promise<{ cron: string }> }
): Promise<NextResponse> {
  if (!isVercelCron(request)) {
    console.error("[Subscription Renewal] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  console.log(`[Subscription Renewal] Starting renewal process at ${new Date().toISOString()}`);

  try {
    // Get current date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reset email counter for subscriptions that started today (new cycle began)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const subscriptionsStartedToday = await prisma.subscription.findMany({
      where: {
        isActive: true,
        numberEmailSent: { gt: 0 }, // Has sent emails in previous cycle
        startDate: {
          gte: today, // Started today
          lt: tomorrow, // But not future dates
        },
      },
      select: {
        id: true,
        name: true,
        numberEmailSent: true,
      },
    });

    let emailCountersReset = 0;
    if (subscriptionsStartedToday.length > 0) {
      const resetResult = await prisma.subscription.updateMany({
        where: {
          id: { in: subscriptionsStartedToday.map((s) => s.id) },
        },
        data: {
          numberEmailSent: 0,
        },
      });

      emailCountersReset = resetResult.count;
      console.log(
        `[Subscription Renewal] Reset email counters for ${emailCountersReset} subscription(s) that started today`
      );

      subscriptionsStartedToday.forEach((sub) => {
        console.log(
          `[Subscription Renewal] Reset counter for subscription ${sub.id} (${sub.name}) from ${sub.numberEmailSent} to 0`
        );
      });
    }

    // Find subscriptions due for renewal
    // Using exact date match (currentDate == endDate)
    const subscriptionsDueForRenewal = await prisma.subscription.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        startDate: true,
        endDate: true,
        cycleType: true,
        cycleInMonths: true,
        cycleDays: true,
      },
    });

    // Filter subscriptions that need renewal based on exact date match
    const subscriptionsToRenew = subscriptionsDueForRenewal.filter((sub) =>
      shouldRenewSubscription(sub.endDate, today, true)
    );

    console.log(
      `[Subscription Renewal] Found ${subscriptionsToRenew.length} subscription(s) due for renewal`
    );

    if (subscriptionsToRenew.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No subscriptions require renewal today",
          data: [],
          meta: {
            checkedAt: new Date().toISOString(),
            totalChecked: subscriptionsDueForRenewal.length,
            totalRenewed: 0,
            emailCountersReset,
            processingTimeMs: Date.now() - startTime,
          },
        },
        { status: 200 },
      );
    }

    const updates: UpdatedSubscription[] = [];
    const errors: RenewalError[] = [];

    // Process each subscription renewal in a transaction to prevent data loss
    for (const sub of subscriptionsToRenew) {
      try {
        await prisma.$transaction(async (tx) => {
          // Calculate new dates
          const renewal = calculateNextRenewalDates(
            sub.endDate,
            sub.cycleType as CycleType,
            sub.cycleInMonths,
            sub.cycleDays
          );

          // Update subscription with new dates
          await tx.subscription.update({
            where: { id: sub.id },
            data: {
              startDate: renewal.newStartDate,
              endDate: renewal.newEndDate,
              numberEmailSent: 0,
              updatedAt: new Date(),
            },
          });

          // Track successful update
          updates.push({
            id: sub.id,
            name: sub.name,
            userId: sub.userId,
            previousStartDate: sub.startDate,
            previousEndDate: sub.endDate,
            newStartDate: renewal.newStartDate,
            newEndDate: renewal.newEndDate,
            cycleType: sub.cycleType as CycleType,
            cycleInMonths: sub.cycleInMonths,
            cycleDays: sub.cycleDays,
            daysExtended: renewal.daysExtended,
          });

          // Log successful renewal
          const logMessage = formatRenewalLog(
            sub.id,
            sub.name,
            sub.userId,
            sub.endDate,
            renewal.newEndDate,
            sub.cycleType as CycleType,
            renewal.daysExtended
          );
          console.log(logMessage);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(
          `[Subscription Renewal] Failed to renew subscription ${sub.id} (${sub.name}):`,
          errorMessage
        );

        errors.push({
          id: sub.id,
          name: sub.name,
          error: errorMessage,
        });
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(
      `[Subscription Renewal] Completed: ${updates.length} successful, ${errors.length} failed, ${emailCountersReset} counters reset, ${processingTime}ms`
    );

    return NextResponse.json({
      success: true,
      message: `${updates.length} subscription(s) renewed successfully`,
      data: updates.map((update) => ({
        subscriptionId: update.id,
        subscriptionName: update.name,
        userId: update.userId,
        cycleType: update.cycleType,
        previousStartDate: update.previousStartDate.toISOString(),
        previousEndDate: update.previousEndDate.toISOString(),
        newStartDate: update.newStartDate.toISOString(),
        newEndDate: update.newEndDate.toISOString(),
        daysExtended: update.daysExtended,
      })),
      errors: errors.length > 0 ? errors : undefined,
      meta: {
        renewedAt: new Date().toISOString(),
        totalChecked: subscriptionsDueForRenewal.length,
        totalDueForRenewal: subscriptionsToRenew.length,
        totalRenewed: updates.length,
        totalFailed: errors.length,
        emailCountersReset,
        processingTimeMs: processingTime,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Subscription Renewal] Critical error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process subscription renewals",
        details: errorMessage,
      },
      { status: 500 },
    );
  } finally {
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
