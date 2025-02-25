import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import classNames from "classnames";

export default function FormDialog({
  title,
  children,
  isOpen,
  setIsOpen,
  onCloseAction,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCloseAction?: () => void;
}): React.ReactNode {
  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={classNames(
        "fixed inset-0 z-40 flex items-center justify-center bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in lg:left-72",
        isOpen ? "block" : "hidden",
      )}
    >
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="relative rounded-lg bg-white shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="ms-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              onClick={() => {
                setIsOpen(false);
                onCloseAction?.();
              }}
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
