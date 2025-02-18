import { Rate } from "@prisma/client";

const DECIMAL_PLACES = 2;
const DEFAULT_BASE = "USD";

export const dollar = (currency: string = DEFAULT_BASE): Intl.NumberFormat =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });

const validateCurrency = (code: string, rates: Rate[]): boolean => {
  if (!code || typeof code !== "string") return false;
  const normalizedCode = code.toUpperCase().trim();
  return rates.some((rate) => rate.code === normalizedCode);
};

const getCurrencyRate = (code: string, rates: Rate[]): number => {
  const rate = rates.find((rate) => rate.code === code.toUpperCase().trim());
  return rate?.rate ?? 0;
};

export const convertBaseCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Rate[],
  options: {
    decimalPlaces?: number;
  } = {},
): number => {
  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const upperFromCurrency = fromCurrency.toUpperCase().trim();
  const upperToCurrency = toCurrency.toUpperCase().trim();

  if (!validateCurrency(upperFromCurrency, rates)) {
    throw new Error(`Invalid or unsupported currency: ${fromCurrency}`);
  }

  if (!validateCurrency(upperToCurrency, rates)) {
    throw new Error(`Invalid or unsupported currency: ${toCurrency}`);
  }

  const decimalPlaces = options.decimalPlaces ?? DECIMAL_PLACES;

  if (upperFromCurrency === upperToCurrency) {
    return Number(amount.toFixed(decimalPlaces));
  }

  try {
    const fromRate = getCurrencyRate(upperFromCurrency, rates);
    const toRate = getCurrencyRate(upperToCurrency, rates);

    if (!fromRate || !toRate) {
      throw new Error("Error during currency conversion calculation");
    }

    return Number(((amount / fromRate) * toRate).toFixed(decimalPlaces));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Currency conversion failed: ${error.message}`);
    }
    throw new Error("Error during currency conversion calculation");
  }
};
