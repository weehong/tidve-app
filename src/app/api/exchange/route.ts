import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const exchangeRates = await prisma.exchangeRate.findMany({
      orderBy: {
        code: "asc",
      },
    });

    return NextResponse.json(exchangeRates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 },
    );
  }
}
