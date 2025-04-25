import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/libs/auth/auth0";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

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
        cycleInMonths: true,
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

    const { name, currency, price, cycle, start_date, end_date, url } =
      await request.json();

    const subscription = await prisma.subscription.create({
      data: {
        userId: session?.user.sub!,
        name,
        currency,
        price,
        cycleInMonths: cycle,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        url,
      },
      select: {
        id: true,
        name: true,
        currency: true,
        price: true,
        cycleInMonths: true,
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
