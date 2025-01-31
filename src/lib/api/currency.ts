import { CurrenciesProp } from "@/type/CurrencyProp";

export const getExchangeRates = async (baseCurrency: string) => {
  const res = await fetch(
    `https://api.fxratesapi.com/latest?base=${baseCurrency}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await res.json();

  return data.rates;
};

export const getCurrencies = async () => {
  const res = await fetch("https://api.fxratesapi.com/currencies");

  if (!res.ok) {
    throw new Error("Failed to fetch currencies");
  }

  const data = (await res.json()) as CurrenciesProp;

  return Object.fromEntries(
    Object.entries(data).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  );
};
