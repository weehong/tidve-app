"use client";

import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import Spinner from "@/components/spinner/Spinner";
import { TableBodyProps } from "@/types/table";

export function TableBody<TData>({
  table,
  isLoading,
  error,
  onRefresh,
  customLoadingComponent,
  customErrorComponent,
  onRowClick,
  rowClassName,
}: TableBodyProps<TData>): React.ReactNode {
  const getRowClassName = (row: TData) => {
    if (typeof rowClassName === "function") {
      return rowClassName(row);
    }
    return rowClassName || "";
  };

  if (isLoading) {
    return (
      <tr className="flex justify-center bg-white sm:table-row dark:border-gray-700 dark:bg-gray-800">
        <td colSpan={table.getAllColumns().length}>
          <div className="flex h-full w-screen items-center justify-center py-8">
            {customLoadingComponent || <Spinner />}
          </div>
        </td>
      </tr>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <tr className="flex justify-center bg-white sm:table-row dark:border-gray-700 dark:bg-gray-800">
        <td colSpan={table.getAllColumns().length}>
          <div className="flex h-full w-full items-center justify-center py-8">
            No Subscription
          </div>
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <td colSpan={table.getAllColumns().length}>
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-8">
            {customErrorComponent || (
              <>
                <p>Error: {error.message}</p>
                {onRefresh && (
                  <button
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={onRefresh}
                  >
                    Refresh
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className={classNames(
            "flex flex-col rounded-md border border-gray-200 bg-white px-5 py-5 sm:table-row sm:p-0 dark:border-gray-700 dark:bg-gray-800",
            getRowClassName(row.original),
            { "cursor-pointer hover:bg-gray-50": onRowClick },
          )}
          onClick={() => onRowClick?.(row.original)}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="py-1.5 align-top font-medium text-gray-900 sm:px-3 dark:text-white"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
