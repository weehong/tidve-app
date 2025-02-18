import { create } from "zustand";

export const useProfileStore = create((set) => ({
  baseCurrency: null,
  setBaseCurrency: (baseCurrency: string) => set({ baseCurrency }),
}));
