export class CurrencyConversionError extends Error {
  constructor(
    message: string,
    public code: string,
    public type: "INVALID_AMOUNT" | "RATE_NOT_FOUND" | "SAME_CURRENCY",
  ) {
    super(message);
    this.name = "CurrencyConversionError";
  }
}
