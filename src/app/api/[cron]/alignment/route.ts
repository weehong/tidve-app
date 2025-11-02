import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { isVercelCron } from "@/libs/helper/check-cron-header";
import {
  calculateAlignedDates,
  needsAlignment,
  formatAlignmentLog,
  type AlignmentResult,
  type SubscriptionToAlign,
} from "@/utils/subscription-alignment";
import { CycleType } from "@/types/subscription";

const prisma = new PrismaClient();

type AlignmentError = {
  id: number;
  name: string;
  error: string;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isVercelCron(request)) {
    console.error("[Subscription Alignment] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  console.log(
    `[Subscription Alignment] Starting alignment process at ${new Date().toISOString()}`
  );

  try {
    const today = new Date();

    // Fetch all active subscriptions with MONTHLY cycle type
    const subscriptionsToCheck = await prisma.subscription.findMany({
      where: {
        isActive: true,
        cycleType: CycleType.MONTHLY,
        cycleInMonths: {
          in: [1, 12], // Only monthly (1) and yearly (12) cycles
        },
      },
      select: {
        id: true,
        name: true,
        userId: true,
        startDate: true,
        endDate: true,
        cycleType: true,
        cycleInMonths: true,
      },
    });

    console.log(
      `[Subscription Alignment] Checking ${subscriptionsToCheck.length} subscription(s) for alignment`
    );

    if (subscriptionsToCheck.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No subscriptions to check for alignment",
          data: [],
          meta: {
            checkedAt: new Date().toISOString(),
            totalChecked: 0,
            totalAligned: 0,
            totalSkipped: 0,
            processingTimeMs: Date.now() - startTime,
          },
        },
        { status: 200 }
      );
    }

    // Filter subscriptions that need alignment
    const subscriptionsNeedingAlignment = subscriptionsToCheck.filter((sub) =>
      needsAlignment(sub as SubscriptionToAlign, today)
    );

    console.log(
      `[Subscription Alignment] Found ${subscriptionsNeedingAlignment.length} subscription(s) requiring alignment`
    );

    const alignments: AlignmentResult[] = [];
    const skipped: AlignmentResult[] = [];
    const errors: AlignmentError[] = [];

    // Process each subscription
    for (const sub of subscriptionsToCheck) {
      try {
        const alignedDates = calculateAlignedDates(sub as SubscriptionToAlign, today);

        if (!alignedDates) {
          // This shouldn't happen given our filters, but handle it anyway
          continue;
        }

        const { expectedStart, expectedEnd } = alignedDates;
        const requiresUpdate = needsAlignment(sub as SubscriptionToAlign, today);

        if (requiresUpdate) {
          // Update subscription with aligned dates using a transaction
          await prisma.$transaction(async (tx) => {
            await tx.subscription.update({
              where: { id: sub.id },
              data: {
                startDate: expectedStart,
                endDate: expectedEnd,
                numberEmailSent: 0, // Reset email counter when dates are aligned
                updatedAt: new Date(),
              },
            });
          });

          const result: AlignmentResult = {
            id: sub.id,
            name: sub.name,
            userId: sub.userId,
            previousStartDate: sub.startDate,
            previousEndDate: sub.endDate,
            newStartDate: expectedStart,
            newEndDate: expectedEnd,
            cycleType: sub.cycleType as CycleType,
            cycleInMonths: sub.cycleInMonths,
            wasAligned: true,
          };

          alignments.push(result);

          // Log alignment
          const logMessage = formatAlignmentLog(
            sub.id,
            sub.name,
            sub.userId,
            sub.cycleType as CycleType,
            sub.cycleInMonths,
            sub.startDate,
            sub.endDate,
            expectedStart,
            expectedEnd,
            true
          );
          console.log(logMessage);
        } else {
          // Already aligned - skip but track
          const result: AlignmentResult = {
            id: sub.id,
            name: sub.name,
            userId: sub.userId,
            previousStartDate: sub.startDate,
            previousEndDate: sub.endDate,
            newStartDate: expectedStart,
            newEndDate: expectedEnd,
            cycleType: sub.cycleType as CycleType,
            cycleInMonths: sub.cycleInMonths,
            wasAligned: false,
          };

          skipped.push(result);

          // Log skip
          const logMessage = formatAlignmentLog(
            sub.id,
            sub.name,
            sub.userId,
            sub.cycleType as CycleType,
            sub.cycleInMonths,
            sub.startDate,
            sub.endDate,
            expectedStart,
            expectedEnd,
            false
          );
          console.log(logMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(
          `[Subscription Alignment] Failed to align subscription ${sub.id} (${sub.name}):`,
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
      `[Subscription Alignment] Completed: ${alignments.length} aligned, ${skipped.length} skipped, ${errors.length} failed, ${processingTime}ms`
    );

    return NextResponse.json({
      success: true,
      message: `${alignments.length} subscription(s) aligned successfully`,
      data: alignments.map((alignment) => ({
        subscriptionId: alignment.id,
        subscriptionName: alignment.name,
        userId: alignment.userId,
        cycleType: alignment.cycleType,
        cycleInMonths: alignment.cycleInMonths,
        previousStartDate: alignment.previousStartDate.toISOString(),
        previousEndDate: alignment.previousEndDate.toISOString(),
        newStartDate: alignment.newStartDate.toISOString(),
        newEndDate: alignment.newEndDate.toISOString(),
      })),
      skipped: skipped.map((skip) => ({
        subscriptionId: skip.id,
        subscriptionName: skip.name,
        userId: skip.userId,
        cycleType: skip.cycleType,
        cycleInMonths: skip.cycleInMonths,
        currentStartDate: skip.previousStartDate.toISOString(),
        currentEndDate: skip.previousEndDate.toISOString(),
      })),
      errors: errors.length > 0 ? errors : undefined,
      meta: {
        alignedAt: new Date().toISOString(),
        totalChecked: subscriptionsToCheck.length,
        totalAligned: alignments.length,
        totalSkipped: skipped.length,
        totalFailed: errors.length,
        processingTimeMs: processingTime,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Subscription Alignment] Critical error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process subscription alignment",
        details: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
