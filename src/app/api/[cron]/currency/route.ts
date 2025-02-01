import { type NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { getExternalCurrencies } from "@/lib/api/currency";
import { CurrenciesProps } from "@/type/CurrencyProp";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const currencies: CurrenciesProps = await getExternalCurrencies();

    const results = {
      created: 0,
      updated: 0,
      errors: 0,
    };

    const currencyEntries = Object.entries(currencies);
    const BATCH_SIZE = 50;

    for (let i = 0; i < currencyEntries.length; i += BATCH_SIZE) {
      const batch = currencyEntries.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async ([code, currencyData]) => {
          try {
            await prisma.currency.upsert({
              where: { code },
              update: {
                name: currencyData.name,
                decimal_digits: currencyData.decimal_digits,
                name_plural: currencyData.name_plural,
                rounding: currencyData.rounding,
                symbol: currencyData.symbol,
                symbol_native: currencyData.symbol_native,
              },
              create: {
                code,
                name: currencyData.name,
                decimal_digits: currencyData.decimal_digits,
                name_plural: currencyData.name_plural,
                rounding: currencyData.rounding,
                symbol: currencyData.symbol,
                symbol_native: currencyData.symbol_native,
              },
            });

            const existing = await prisma.currency.findUnique({
              where: { code },
              select: { code: true },
            });

            if (existing) {
              results.updated++;
            } else {
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
      message: "Currencies processed successfully",
      results: {
        totalProcessed: currencyEntries.length,
        ...results,
        summary: `Created: ${results.created}, Updated: ${results.updated}, Errors: ${results.errors}`,
      },
    });
  } catch (error) {
    console.error("Error updating currencies:", error);
    return NextResponse.json(
      {
        error: "Failed to process currencies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
