import { PrismaClient } from "@prisma/client";

import { getExternalExchangeRates } from "../src/libs/api/rate";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fetching exchange rates from API...");
    const rates = await getExternalExchangeRates();

    console.log("Upserting exchange rates into database...");
    const rateEntries = Object.entries(rates.rates).map(([code, rate]) => ({
      code,
      rate: Number(rate),
    }));

    // Upsert each rate
    for (const rate of rateEntries) {
      await prisma.rate.upsert({
        where: { code: rate.code },
        update: { rate: rate.rate },
        create: rate,
      });
    }

    console.log("Successfully seeded exchange rates!");
  } catch (error) {
    console.error("Error seeding exchange rates:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
