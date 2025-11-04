import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";
import { prisma } from "@/libs/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth0.getSession();

    if (!session?.user.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currencies = await prisma.rate.findMany();

    if (!currencies) {
      return NextResponse.json(
        { error: "Failed to fetch currencies from external API" },
        { status: 500 },
      );
    }

    return NextResponse.json(currencies);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 },
    );
  }
}
