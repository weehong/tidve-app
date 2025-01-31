import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const currencies = await prisma.currency.findMany({
      orderBy: {
        code: "asc",
      },
    });

    return NextResponse.json(currencies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 },
    );
  }
}
