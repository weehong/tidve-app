"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

import { TablePaginationProps } from "@/types/table";

export function TablePagination<TData>({
  table,
  pageSize,
  data,
}: TablePaginationProps<TData>): React.ReactNode {
  return (
    <div className="flex w-full items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 justify-between py-4 sm:hidden">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={classNames(
            "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            { "opacity-50": !table.getCanPreviousPage() },
          )}
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={classNames(
            "relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
            { "opacity-50": !table.getCanNextPage() },
          )}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <nav
          className="flex-column flex flex-1 flex-wrap items-center justify-between py-4 md:flex-row"
          aria-label="Table navigation"
        >
          <div>
            <p className="text-sm text-gray-700">
              From{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {isNaN(
                  Math.min(
                    (table.getState().pagination.pageIndex + 1) * pageSize,
                    data.length,
                  ),
                )
                  ? 0
                  : Math.min(
                      (table.getState().pagination.pageIndex + 1) * pageSize,
                      data.length,
                    )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              results
            </p>
          </div>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              type="button"
              className={classNames(
                "relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10",
                { "opacity-50": !table.getCanPreviousPage() },
              )}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              type="button"
              className={classNames(
                "relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10",
                { "opacity-50": !table.getCanNextPage() },
              )}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
          </span>
        </nav>
      </div>
    </div>
  );
}
