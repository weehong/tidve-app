type Currency = {
  code: string;
  name: string;
  decimal_digits: number;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
};

export type CurrenciesProp = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  icon_name?: string;
  name_plural: string;
  type: string;
  countries: string[];
};
