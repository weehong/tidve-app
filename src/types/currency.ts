type CurrencyInfoProps = {
  code: string;
  name: string;
  decimal_digits: number;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
};

export type CurrenciesProps = {
  [key: string]: CurrencyInfoProps;
};

export type CurrencyOptionProps = {
  value: string;
  label: string;
};
