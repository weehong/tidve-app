import { CurrenciesProps, CurrencyOptionProps } from "@/types/currency";
import { CycleType } from "@/types/subscription";

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

/**
 * Format cycle display based on cycle type
 */
export const formatCycleDisplay = (
  cycleType: CycleType,
  cycleInMonths: number,
  cycleDays?: number | null
): string => {
  switch (cycleType) {
    case CycleType.DAILY:
      return "Daily";

    case CycleType.MONTHLY:
      return determineCycleType(cycleInMonths);

    case CycleType.CUSTOM:
      if (cycleDays) {
        if (cycleDays === 7) return "Weekly";
        if (cycleDays === 14) return "Bi-Weekly";
        return `Every ${cycleDays} days`;
      }
      return "Custom";

    default:
      return "Unknown";
  }
};
