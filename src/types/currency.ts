type CurrencyInfo = {
  code: string;
  name: string;
  decimal_digits: number;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
};

export interface CurrenciesProps {
  [key: string]: CurrencyInfo;
}
