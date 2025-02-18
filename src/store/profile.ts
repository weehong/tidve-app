import { create } from "zustand";

type CurrencyStore = {
  baseCurrency: string | null;
  setBaseCurrency: (baseCurrency: string) => void;
};

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  baseCurrency: null,
  setBaseCurrency: (baseCurrency: string) => set({ baseCurrency }),
}));
