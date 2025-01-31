import { CurrencyConversionError } from "@/error/currency-conversion-error";
import { ExchangeRateProp } from "@/type/ExchangeRateProp";

export const dollar = (currency: string | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  });

export const formatCurrencyAmount = (
  amount: number,
  currencyCode: string,
  locale: string = "en-US",
): string => {
  console.log(currencyCode);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const convertBaseCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: ExchangeRateProp,
) => {
  if (!amount || amount <= 0 || !Number.isFinite(amount)) {
    throw new CurrencyConversionError(
      `Invalid amount: ${amount}`,
      "INVALID_AMOUNT",
      "INVALID_AMOUNT",
    );
  }

  const rateMap = new Map(exchangeRates ? Object.entries(exchangeRates) : []);
  const fromRate = rateMap.get(fromCurrency);
  const toRate = rateMap.get(toCurrency);

  if (!fromRate) {
    throw new CurrencyConversionError(
      `Exchange rate not found for ${fromCurrency}`,
      fromCurrency,
      "RATE_NOT_FOUND",
    );
  }

  if (!toRate) {
    throw new CurrencyConversionError(
      `Exchange rate not found for ${toCurrency}`,
      toCurrency,
      "RATE_NOT_FOUND",
    );
  }

  if (fromCurrency === toCurrency) {
    return Number(amount.toFixed(2));
  }

  try {
    const result = amount * (toRate / fromRate);
    return Number(result.toFixed(2));
  } catch (error) {
    throw new CurrencyConversionError(
      "Error during currency conversion calculation",
      "CALCULATION_ERROR",
      "INVALID_AMOUNT",
    );
  }
};
