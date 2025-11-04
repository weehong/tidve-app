import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";
import { prisma } from "@/libs/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id) },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id), isActive: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    if (subscription.userId !== session.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Map both camelCase (from form) and snake_case field names
    const name = body.name;
    const currency = body.currency;
    const price = body.price;
    const cycleType = body.cycleType || body.cycle_type || subscription.cycleType;
    const cycleInMonths = body.cycleInMonths || body.cycle;
    const cycleDays = body.cycleDays !== undefined ? body.cycleDays : (body.cycle_days !== undefined ? body.cycle_days : subscription.cycleDays);
    const startDate = body.startDate || body.start_date;
    const endDate = body.endDate || body.end_date;
    const url = body.url;

    // Check if endDate changed to reset email counter
    // EXCEPT for daily 1-day subscriptions (they need emails every day)
    const endDateChanged = new Date(endDate).getTime() !== subscription.endDate.getTime();
    const isDailyOneDay = cycleType === "daily" && cycleDays === 1;
    const shouldResetEmailCounter = endDateChanged && !isDailyOneDay;

    const updated = await prisma.subscription.update({
      where: { id: Number(id) },
      data: {
        name,
        currency,
        price,
        cycleType,
        cycleInMonths,
        cycleDays,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberEmailSent: shouldResetEmailCounter ? 0 : subscription.numberEmailSent,
        url,
        isActive: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      currency: updated.currency,
      price: updated.price,
      cycleType: updated.cycleType,
      cycleInMonths: updated.cycleInMonths,
      cycleDays: updated.cycleDays,
      startDate: updated.startDate,
      endDate: updated.endDate,
      url: updated.url,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching subscription", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id) },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    if (subscription.userId !== session.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subscription.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Subscription deleted" });
  } catch (error) {
    console.error("Error deleting subscription", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
