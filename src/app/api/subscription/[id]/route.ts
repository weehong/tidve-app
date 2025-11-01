import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/libs/auth/auth0";

const prisma = new PrismaClient();

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

    const {
      name,
      currency,
      price,
      cycle,
      cycle_type,
      cycle_days,
      start_date,
      end_date,
      url
    } = await request.json();

    const updated = await prisma.subscription.update({
      where: { id: Number(id) },
      data: {
        name,
        currency,
        price,
        cycleType: cycle_type || subscription.cycleType,
        cycleInMonths: cycle,
        cycleDays: cycle_days !== undefined ? cycle_days : subscription.cycleDays,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
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
