import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";
import { prisma } from "@/libs/prisma";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;
    const searchTerm = request.nextUrl.searchParams.get("searchTerm");

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.sub,
        isActive: true,
        OR: [
          {
            name: {
              contains: searchTerm || "",
              mode: "insensitive",
            },
          },
          {
            url: {
              contains: searchTerm || "",
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        currency: true,
        price: true,
        cycleType: true,
        cycleInMonths: true,
        cycleDays: true,
        startDate: true,
        endDate: true,
        url: true,
      },
      skip: pageSize === -1 ? undefined : (page - 1) * pageSize,
      take: pageSize === -1 ? undefined : pageSize + 1,
      orderBy: {
        endDate: "asc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Map both camelCase (from form) and snake_case field names
    const name = body.name;
    const currency = body.currency;
    const price = body.price;
    const cycleType = body.cycleType || body.cycle_type || 'MONTHLY';
    const cycleInMonths = body.cycleInMonths || body.cycle;
    const cycleDays = body.cycleDays !== undefined ? body.cycleDays : (body.cycle_days || null);
    const startDate = body.startDate || body.start_date;
    const endDate = body.endDate || body.end_date;
    const url = body.url;

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.sub,
        name,
        currency,
        price,
        cycleType,
        cycleInMonths,
        cycleDays,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        url,
      },
      select: {
        id: true,
        name: true,
        currency: true,
        price: true,
        cycleType: true,
        cycleInMonths: true,
        cycleDays: true,
        startDate: true,
        endDate: true,
        url: true,
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
