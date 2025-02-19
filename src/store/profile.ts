import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyStore = {
  baseCurrency: string | null;
  setBaseCurrency: (baseCurrency: string) => void;
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      baseCurrency: null,
      setBaseCurrency: (baseCurrency: string) => set({ baseCurrency }),
    }),
    {
      name: "currency",
    },
  ),
);
