export type RateProps = {
  [key: string]: number;
};

export type CurrencyRateProps = {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: RateProps;
};
