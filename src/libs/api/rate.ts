import { Rate } from "@prisma/client";

import { CurrencyRateProps } from "@/types/exchange-rate";

export const getExternalExchangeRates =
  async (): Promise<CurrencyRateProps> => {
    const res = await fetch("https://api.fxratesapi.com/latest?base=USD");

    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    return await res.json();
  };

export const getExchangeRates = async (): Promise<Rate[]> => {
  const res = await fetch("/api/rate");

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return await res.json();
};
