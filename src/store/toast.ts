import { create } from "zustand";

type ToastStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  type: "success" | "error" | "warning" | "info";
  setType: (type: "success" | "error" | "warning" | "info") => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  message: "",
  setMessage: (message: string) => set({ message }),
  type: "success",
  setType: (type: "success" | "error" | "warning" | "info") => set({ type }),
}));
