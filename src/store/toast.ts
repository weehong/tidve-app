import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Legacy compatibility - will use the first toast for backward compatibility
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  type: ToastType;
  setType: (type: ToastType) => void;
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message: string, type: ToastType) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),

  // Legacy compatibility
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {
    const state = get();
    if (isOpen && state.message) {
      // When opening, add a toast with current message and type
      state.addToast(state.message, state.type);
    } else if (!isOpen) {
      // When closing, clear all toasts
      state.clearToasts();
    }
    set({ isOpen });
  },
  message: "",
  setMessage: (message: string) => set({ message }),
  type: "success",
  setType: (type: ToastType) => set({ type }),
}));
