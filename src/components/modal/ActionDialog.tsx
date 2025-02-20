"use client";

import { useMemo } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

type DialogType = "success" | "error" | "warning" | "info" | "default";

type DialogStyleConfig = {
  iconClass: string;
  buttonClass: string;
  Icon: React.ElementType;
};

type ActionDialogProps = {
  type?: DialogType;
  icon?: React.ReactNode;
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  onConfirmButtonLabel: string;
};

export default function ActionDialog({
  type = "default",
  title,
  description,
  isOpen,
  setIsOpen,
  onConfirm,
  onConfirmButtonLabel,
}: ActionDialogProps): React.ReactNode {
  const styleConfig: Record<DialogType, DialogStyleConfig> = useMemo(
    () => ({
      success: {
        iconClass: "text-green-500",
        buttonClass:
          "bg-green-600 hover:bg-green-700 focus-visible:outline-green-600",
        Icon: CheckCircleIcon,
      },
      error: {
        iconClass: "text-red-500",
        buttonClass:
          "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600",
        Icon: XCircleIcon,
      },
      warning: {
        iconClass: "text-yellow-500",
        buttonClass:
          "bg-yellow-600 hover:bg-yellow-700 focus-visible:outline-yellow-600",
        Icon: ExclamationTriangleIcon,
      },
      info: {
        iconClass: "text-blue-500",
        buttonClass:
          "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600",
        Icon: InformationCircleIcon,
      },
      default: {
        iconClass: "text-indigo-500",
        buttonClass:
          "bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600",
        Icon: InformationCircleIcon,
      },
    }),
    [],
  );

  const currentStyle = styleConfig[type];
  const { Icon } = currentStyle;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={classNames(
              "relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4",
              "bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
              "data-[closed]:translate-y-4 data-[closed]:opacity-0",
              "data-[enter]:duration-300 data-[enter]:ease-out",
              "data-[leave]:duration-200 data-[leave]:ease-in",
              "data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
            )}
          >
            <div className="sm:flex sm:items-start">
              <div
                className={classNames(
                  "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
                  "sm:mx-0 sm:h-10 sm:w-10",
                  currentStyle.iconClass,
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base leading-6 font-semibold text-gray-900"
                >
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className={classNames(
                  "inline-flex w-full justify-center rounded-md px-3 py-2",
                  "text-sm font-semibold text-white shadow-sm",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  "sm:col-start-2",
                  currentStyle.buttonClass,
                )}
              >
                {onConfirmButtonLabel}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
