import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { getExternalExchangeRates } from "@/libs/api/rate";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const currencies = await getExternalExchangeRates();

    if (!currencies) {
      return NextResponse.json(
        { error: "Failed to fetch currencies from external API" },
        { status: 500 },
      );
    }

    for (const [code, rate] of Object.entries(currencies.rates)) {
      await prisma.rate.upsert({
        where: { code },
        update: { rate: parseFloat(rate as string) },
        create: { code, rate: parseFloat(rate as string) },
      });
    }

    return NextResponse.json({ message: "Currency rates updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 },
    );
  }
}
