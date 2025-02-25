import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/libs/auth/auth0";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
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
  { params }: { params: Promise<{ id: number }> },
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

    const { name, currency, price, cycle, start_date, end_date, url } =
      await request.json();

    await prisma.subscription.update({
      where: { id: Number(id) },
      data: {
        name,
        currency,
        price,
        cycleInMonths: cycle,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        url,
        isActive: true,
      },
    });

    return NextResponse.json({
      id: subscription.id,
      name: subscription.name,
      currency: subscription.currency,
      price: subscription.price,
      cycleInMonths: subscription.cycleInMonths,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      url: subscription.url,
      isActive: subscription.isActive,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
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
  { params }: { params: Promise<{ id: number }> },
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
