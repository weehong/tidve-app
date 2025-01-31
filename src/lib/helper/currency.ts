import { CurrencyConversionError } from "@/error/currency-conversion-error";
import { ExchangeRateProps } from "@/type/ExchangeRateProp";

const DECIMAL_PLACES = 2;
const DEFAULT_BASE = "USD";

export const formatCurrencyAmount = (
  amount: number,
  currencyCode: string,
  locale: string = "en-US",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(amount);
};

export const dollar = (currency: string = DEFAULT_BASE) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });

const validateCurrency = (
  code: string,
  rates: ExchangeRateProps[],
): boolean => {
  if (!code || typeof code !== "string") return false;
  const normalizedCode = code.toUpperCase().trim();
  return rates.some((rate) => rate.code === normalizedCode);
};

export const convertBaseCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRateProps[],
  options: {
    decimalPlaces?: number;
    baseReference?: string;
  } = {},
): number => {
  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    throw new CurrencyConversionError(
      `Invalid amount: ${amount}`,
      "INVALID_AMOUNT",
      "INVALID_AMOUNT",
    );
  }

  const upperFromCurrency = fromCurrency.toUpperCase().trim();
  const upperToCurrency = toCurrency.toUpperCase().trim();

  if (!validateCurrency(upperFromCurrency, rates)) {
    throw new CurrencyConversionError(
      `Invalid or unsupported currency: ${fromCurrency}`,
      fromCurrency,
      "INVALID_CURRENCY",
    );
  }

  if (!validateCurrency(upperToCurrency, rates)) {
    throw new CurrencyConversionError(
      `Invalid or unsupported currency: ${toCurrency}`,
      toCurrency,
      "INVALID_CURRENCY",
    );
  }

  const decimalPlaces = options.decimalPlaces ?? DECIMAL_PLACES;

  if (upperFromCurrency === upperToCurrency) {
    return Number(amount.toFixed(decimalPlaces));
  }

  try {
    const fromRate = rates.find((rate) => rate.code === upperFromCurrency);
    const toRate = rates.find((rate) => rate.code === upperToCurrency);

    if (!fromRate || !toRate) {
      throw new CurrencyConversionError(
        "Error during currency conversion calculation",
        "CALCULATION_ERROR",
        "CALCULATION_ERROR",
      );
    }

    return Number(
      ((amount / fromRate.rate) * toRate.rate).toFixed(decimalPlaces),
    );
  } catch (error) {
    throw new CurrencyConversionError(
      "Error during currency conversion calculation",
      "CALCULATION_ERROR",
      "CALCULATION_ERROR",
    );
  }
};
