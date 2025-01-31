import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { getExternalExchangeRates } from "@/lib/api/currency";
import { ExchangeRateResponse } from "@/type/ExchangeRateProp";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const response: ExchangeRateResponse = await getExternalExchangeRates();

    if (!response.success || !response.rates) {
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 },
      );
    }

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    const currencies = Object.entries(response.rates);
    const BATCH_SIZE = 50;

    for (let i = 0; i < currencies.length; i += BATCH_SIZE) {
      const batch = currencies.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async ([code, newRate]) => {
          try {
            const existingRate = await prisma.exchangeRate.findUnique({
              where: { code: code.toUpperCase() },
            });

            if (existingRate) {
              if (Number(newRate) > Number(existingRate.rate)) {
                await prisma.exchangeRate.update({
                  where: { code: code.toUpperCase() },
                  data: {
                    rate: Number(newRate),
                    updatedAt: new Date(),
                  },
                });
                results.updated++;
              } else {
                results.skipped++;
              }
            } else {
              await prisma.exchangeRate.create({
                data: {
                  code: code.toUpperCase(),
                  rate: Number(newRate),
                },
              });
              results.created++;
            }
          } catch (error) {
            console.error(`Error processing currency ${code}:`, error);
            results.errors++;
          }
        }),
      );
    }

    return NextResponse.json({
      message: "Exchange rates processed successfully",
      timestamp: response.date,
      base: response.base,
      results: {
        totalProcessed: currencies.length,
        ...results,
        summary: `Created: ${results.created}, Updated: ${results.updated}, Skipped: ${results.skipped}, Errors: ${results.errors}`,
      },
    });
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    return NextResponse.json(
      {
        error: "Failed to process exchange rates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
