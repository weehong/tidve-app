import { type NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

import SubscriptionReminderTemplate from "@/email/SubscriptionReminderTemplate";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany();

    for (const profile of profiles) {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: profile.userId,
          isActive: true,
          endDate: {
            lte: new Date(new Date().setMonth(new Date().getMonth() + 3)),
            gte: new Date(),
          },
        },
      });

      if (subscriptions.length > 0) {
        const data = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: profile.email,
          subject: "Hello, World!",
          react: SubscriptionReminderTemplate({
            data: {
              subscriptions: subscriptions,
            },
          }),
        });

        console.log("Email sent", data);
      } else {
        console.log("No subscriptions found for profile", profile.id);

        return NextResponse.json(
          { message: "No subscriptions found for profile" },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email", error);

    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
