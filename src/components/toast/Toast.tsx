"use client";

import { useEffect, useMemo } from "react";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

import { useToastStore } from "@/store/toast";

type ToastType = "success" | "error" | "warning";

interface ToastStyleConfig {
  container: string;
  icon: string;
  IconComponent: React.ElementType;
}

export default function Toast() {
  const { isOpen, setIsOpen, message, type } = useToastStore();

  const styleConfig: Record<ToastType, ToastStyleConfig> = useMemo(
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
    }),
    [],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      timeoutId = setTimeout(() => setIsOpen(false), 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const currentStyle = styleConfig[type as ToastType];
  const { IconComponent } = currentStyle;

  return (
    <div
      role="alert"
      className={classNames(
        "absolute top-5 left-1/2 z-50 ml-auto flex w-full max-w-xs -translate-x-1/2 items-center rounded-lg p-4 text-gray-500 shadow-sm transition sm:top-20 sm:right-5 sm:-translate-x-0 dark:bg-gray-800 dark:text-gray-400",
        currentStyle.container,
      )}
    >
      <div
        className={classNames(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          currentStyle.icon,
        )}
      >
        <IconComponent className="h-10 w-10" />
      </div>

      <div className="mx-3 text-sm font-normal">{message}</div>

      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XMarkIcon className="h-3 w-3" />
      </button>
    </div>
  );
}
