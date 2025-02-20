import { type NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

import SubscriptionRenewal from "@/emails/SubscriptionRenewal";

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
            gte: new Date(),
            lte: new Date(new Date().setDate(new Date().getDate() + 7)),
          },
        },
      });

      if (subscriptions.length > 0) {
        await resend.emails.send({
          from: "Tidve <tidve@resend.dev>",
          to: profile.email,
          subject: "Tidve - Subscription Renewal Reminder",
          react: SubscriptionRenewal({
            username: profile.name,
            subscriptions: subscriptions,
          }),
        });
      } else {
        console.error("No subscriptions found for profile", profile.id);

        return NextResponse.json(
          { message: "No subscriptions found for profile" },
          { status: 200 },
        );
      }
    }

    const emailsSent = profiles.length;

    return NextResponse.json(
      { message: `Emails sent successfully to ${emailsSent} profiles` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email", error);

    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
