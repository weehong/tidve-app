"use client";

import { useEffect, useMemo } from "react";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

import { Toast as ToastType, useToastStore } from "@/store/toast";

interface ToastStyleConfig {
  container: string;
  icon: string;
  IconComponent: React.ElementType;
}

interface SingleToastProps {
  toast: ToastType;
  index: number;
  onRemove: (id: string) => void;
}

function SingleToast({ toast, index, onRemove }: SingleToastProps) {
  const styleConfig: Record<string, ToastStyleConfig> = useMemo(
    () => ({
      success: {
        container:
          "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
        icon: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
        IconComponent: CheckCircleIcon,
      },
      error: {
        container: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
        icon: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
        IconComponent: XMarkIcon,
      },
      warning: {
        container:
          "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200",
        icon: "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200",
        IconComponent: ExclamationTriangleIcon,
      },
      info: {
        container:
          "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200",
        icon: "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200",
        IconComponent: InformationCircleIcon,
      },
    }),
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timeoutId);
  }, [toast.id, onRemove]);

  const currentStyle = styleConfig[toast.type];
  const { IconComponent } = currentStyle;

  // Calculate top position for stacking: 20px base + (index * 80px spacing)
  const topPosition = 20 + index * 80;

  return (
    <div
      role="alert"
      className={classNames(
        "fixed left-1/2 z-[9999] ml-auto flex w-full max-w-xs -translate-x-1/2 items-center rounded-lg p-4 text-gray-500 shadow-lg transition-all duration-300 ease-in-out sm:left-auto sm:right-5 sm:translate-x-0 dark:bg-gray-800 dark:text-gray-400",
        currentStyle.container,
      )}
      style={{ top: `${topPosition}px` }}
    >
      <div
        className={classNames(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          currentStyle.icon,
        )}
      >
        <IconComponent className="h-10 w-10" />
      </div>

      <div className="mx-3 text-sm font-normal">{toast.message}</div>

      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XMarkIcon className="h-3 w-3" />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((toast, index) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          index={index}
          onRemove={removeToast}
        />
      ))}
    </>
  );
}
