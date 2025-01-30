import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/lib/auth/auth0";
import { SubscriptionFormSchema } from "@/lib/validation/subscription";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session?.user.sub,
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error getting subscriptions", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    console.debug("POST /api/subscription");

    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = SubscriptionFormSchema.parse(body);

    const subscription = await prisma.subscription.create({
      data: {
        userId: session?.user.sub!,
        name: validatedData.name,
        currency: validatedData.currency,
        price: validatedData.price,
        cycleInMonths: validatedData.cycle,
        startDate: new Date(validatedData.start_date),
        endDate: new Date(validatedData.end_date),
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error creating subscription", error);
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 400 },
    );
  }
}
