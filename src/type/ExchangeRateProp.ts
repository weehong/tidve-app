export type ExchangeRateProps = {
  id: number;
  code: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
};

export type ExchangeRateResponse = {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: ExchangeRateProps;
};
