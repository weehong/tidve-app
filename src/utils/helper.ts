import { CurrenciesProps, CurrencyOptionProps } from "@/types/currency";

export const renderCurrencyOption = (
  currencies: CurrenciesProps,
): CurrencyOptionProps[] =>
  Object.keys(currencies).map((key) => ({
    value: currencies[key].code,
    label: currencies[key].code,
  }));
