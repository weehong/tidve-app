import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/libs/auth/auth0";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user?.sub) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.sub,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    const body = await request.json();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: session?.user.sub! },
      update: {
        isInitial: body.isInitial,
        currency: body.currency,
      },
      create: {
        userId: session?.user.sub!,
        email: session?.user.email!,
        isInitial: body.isInitial,
        currency: body.currency,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating profile", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
