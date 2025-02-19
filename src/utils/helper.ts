import { CurrenciesProps, CurrencyOptionProps } from "@/types/currency";

export const renderCurrencyOption = (
  currencies: CurrenciesProps,
): CurrencyOptionProps[] =>
  Object.keys(currencies).map((key) => ({
    value: currencies[key].code,
    label: currencies[key].code,
  }));

export const determineCycleType = (months: number): string => {
  if (months <= 0) {
    throw new Error("Cycle must be a positive number.");
  }

  const cycleMap: Record<number, string> = {
    1: "Monthly",
    3: "Quarterly",
    6: "Semi-Annually",
    12: "Annually",
  };

  if (months % 12 === 0) {
    return months === 12 ? "Annually" : `Adhoc (${months / 12}-Year Cycle)`;
  }

  return cycleMap[months] || `Adhoc (${months}-Month Cycle)`;
};
