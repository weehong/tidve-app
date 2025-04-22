import { type NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

import SubscriptionRenewal from "@/emails/SubscriptionRenewal";
import { isVercelCron } from "@/libs/helper/check-cron-header";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CONFIG = {
  FROM: "Tidve <tidve@resend.dev>",
  SUBJECT: "Tidve - Subscription Renewal Reminder",
} as const;

const REMINDER_PERIODS = {
  FIRST_REMINDER: 7,
  SECOND_REMINDER: 3,
} as const;

type EmailProcessResult = {
  email: string;
  username: string;
  subscriptionCount: number;
  status: "success" | "failed";
  error?: string;
};

export async function GET(request: NextRequest) {
  if (!isVercelCron(request)) {
    console.error("[Subscription Reminder] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Subscription Reminder] Starting process");

  try {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + REMINDER_PERIODS.FIRST_REMINDER);

    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + REMINDER_PERIODS.SECOND_REMINDER);

    const subscriptionsToProcess = await prisma.subscription.findMany({
      where: {
        isActive: true,
        OR: [
          {
            endDate: { lt: sevenDaysLater },
            numberEmailSent: 0,
          },
          {
            endDate: { lt: threeDaysLater },
            numberEmailSent: 1,
          },
        ],
      },
      include: {
        profile: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(
      `[Subscription Reminder] Found ${subscriptionsToProcess.length} subscriptions to process`,
    );

    if (subscriptionsToProcess.length === 0) {
      return NextResponse.json(
        {
          message: "No subscriptions found",
          totalProcessed: 0,
          details: [],
        },
        { status: 200 },
      );
    }

    const subscriptionsByUser = subscriptionsToProcess.reduce(
      (acc, subscription) => {
        const userEmail = subscription.profile.email;
        if (!acc[userEmail]) {
          acc[userEmail] = {
            username: subscription.profile.name,
            subscriptions: [],
          };
        }
        acc[userEmail].subscriptions.push(subscription);
        return acc;
      },
      {} as Record<
        string,
        { username: string; subscriptions: typeof subscriptionsToProcess }
      >,
    );

    const userCount = Object.keys(subscriptionsByUser).length;
    console.log(`[Subscription Reminder] Processing ${userCount} users`);

    const emailPromises = Object.entries(subscriptionsByUser).map(
      async ([
        email,
        { username, subscriptions },
      ]): Promise<EmailProcessResult> => {
        try {
          const minEmailsSent = Math.min(
            ...subscriptions.map((sub) => sub.numberEmailSent),
          );

          const expiresIn =
            minEmailsSent === 0
              ? REMINDER_PERIODS.FIRST_REMINDER
              : REMINDER_PERIODS.SECOND_REMINDER;

          await resend.emails.send({
            from: EMAIL_CONFIG.FROM,
            to: email,
            subject: EMAIL_CONFIG.SUBJECT,
            react: SubscriptionRenewal({
              username,
              subscriptions,
              expiresIn,
            }),
          });

          await prisma.$transaction(
            subscriptions.map((subscription) =>
              prisma.subscription.update({
                where: { id: subscription.id },
                data: { numberEmailSent: subscription.numberEmailSent + 1 },
              }),
            ),
          );

          console.log(
            `[Subscription Reminder] Processed successfully: ${email} (${subscriptions.length} subscriptions)`,
          );

          return {
            email,
            username,
            subscriptionCount: subscriptions.length,
            status: "success",
          };
        } catch (error) {
          console.error(
            `[Subscription Reminder] Error processing ${email}:`,
            error,
          );

          return {
            email,
            username,
            subscriptionCount: subscriptions.length,
            status: "failed",
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      },
    );

    const results = await Promise.all(emailPromises);

    const successfulEmails = results.filter(
      (result) => result.status === "success",
    );
    const failedEmails = results.filter((result) => result.status === "failed");
    const totalSubscriptionsSent = successfulEmails.reduce(
      (sum, result) => sum + result.subscriptionCount,
      0,
    );

    console.log(
      `[Subscription Reminder] Completed: ${successfulEmails.length} successful, ${failedEmails.length} failed`,
    );

    const response = {
      message: `Processed ${results.length} users with ${totalSubscriptionsSent} subscriptions`,
      totalProcessed: results.length,
      totalSuccessful: successfulEmails.length,
      totalFailed: failedEmails.length,
      totalSubscriptionsSent,
      details: {
        successful: successfulEmails.map(
          ({ email, username, subscriptionCount }) => ({
            email,
            username,
            subscriptionCount,
          }),
        ),
        failed: failedEmails.map(
          ({ email, username, subscriptionCount, error }) => ({
            email,
            username,
            subscriptionCount,
            error,
          }),
        ),
      },
    };

    return NextResponse.json(response, {
      status: successfulEmails.length > 0 ? 200 : 500,
    });
  } catch (error) {
    console.error("[Subscription Reminder] Fatal error:", error);

    return NextResponse.json(
      {
        error: "Error processing emails",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        totalProcessed: 0,
        details: [],
      },
      { status: 500 },
    );
  }
}
