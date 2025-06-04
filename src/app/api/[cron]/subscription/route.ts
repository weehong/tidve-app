import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { isVercelCron } from "@/libs/helper/check-cron-header";

const prisma = new PrismaClient();

type UpdatedSubscription = {
  id: number;
  name: string;
  previousEndDate: Date;
  newEndDate: Date;
  cycleInMonths: number;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isVercelCron(request)) {
    console.error("[Subscription Reminder] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: { lte: today },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        endDate: true,
        cycleInMonths: true,
        userId: true,
      },
    });

    if (expiredSubscriptions.length === 0) {
      return NextResponse.json(
        { message: "No subscriptions require updates" },
        { status: 200 },
      );
    }

    const updates: UpdatedSubscription[] = [];
    const updatePromises = expiredSubscriptions.map(async (sub) => {
      const newEndDate = new Date(sub.endDate);
      const currentMonth = newEndDate.getMonth();
      newEndDate.setMonth(currentMonth + sub.cycleInMonths);

      const isLastDay =
        newEndDate.getDate() ===
        new Date(
          newEndDate.getFullYear(),
          newEndDate.getMonth() + 1,
          0,
        ).getDate();

      if (isLastDay) {
        newEndDate.setMonth(currentMonth + sub.cycleInMonths + 1);
        newEndDate.setDate(0);
      } else if (
        newEndDate.getMonth() !==
        (currentMonth + sub.cycleInMonths) % 12
      ) {
        newEndDate.setDate(0);
      }

      updates.push({
        id: sub.id,
        name: sub.name,
        previousEndDate: sub.endDate,
        newEndDate,
        cycleInMonths: sub.cycleInMonths,
      });

      return prisma.subscription.update({
        where: { id: sub.id },
        data: {
          endDate: newEndDate,
          updatedAt: new Date(),
          numberEmailSent: 0,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `${updates.length} subscription(s) updated`,
      data: updates.map((update) => ({
        subscriptionId: update.id,
        subscriptionName: update.name,
        previousEndDate: update.previousEndDate.toISOString(),
        newEndDate: update.newEndDate.toISOString(),
        cycleInMonths: update.cycleInMonths,
        daysExtended: Math.round(
          (update.newEndDate.getTime() - update.previousEndDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      })),
      meta: {
        updatedAt: new Date().toISOString(),
        totalProcessed: expiredSubscriptions.length,
      },
    });
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update subscriptions",
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
