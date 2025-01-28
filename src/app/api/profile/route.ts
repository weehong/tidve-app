import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { auth0 } from "@/lib/auth0";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth0.getSession();
    console.debug("GET /api/profile");

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session?.user.sub,
      },
    });

    if (!profile) {
      console.debug("Profile not found");
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    console.debug("Profile found", profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error getting profile", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.debug("POST /api/profile");

  const session = await auth0.getSession();
  const body = await request.json();

  if (!session?.user.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session?.user.sub! },
    update: {
      isInitial: body.isInitial || true,
      currency: body.currency,
    },
    create: {
      userId: session?.user.sub!,
      isInitial: body.isInitial || true,
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
