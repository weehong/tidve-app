export class CurrencyConversionError extends Error {
  constructor(
    message: string,
    public currency: string,
    public code:
      | "INVALID_AMOUNT"
      | "RATE_NOT_FOUND"
      | "CALCULATION_ERROR"
      | "INVALID_CURRENCY",
  ) {
    super(message);
    this.name = "CurrencyConversionError";
  }
}
