import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany();

    profiles.forEach(async (profile) => {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: profile.userId,
          isActive: true,
        },
      });

      for (const subscription of subscriptions) {
        const today = new Date();
        const endDate = new Date(subscription.endDate);

        if (
          endDate.getDate() === today.getDate() &&
          endDate.getMonth() === today.getMonth() &&
          endDate.getFullYear() === today.getFullYear()
        ) {
          const billingCycle = subscription.cycleInMonths;

          const newEndDate = new Date(
            endDate.setMonth(endDate.getMonth() + billingCycle),
          );

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              endDate: newEndDate,
            },
          });

          console.log(
            `Subscription ${subscription.id} extended to ${newEndDate}`,
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching subscriptions" },
      { status: 500 },
    );
  }
}
