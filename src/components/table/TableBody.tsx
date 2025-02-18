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
}: TableBodyProps<TData>) {
  const getRowClassName = (row: TData) => {
    if (typeof rowClassName === "function") {
      return rowClassName(row);
    }
    return rowClassName || "";
  };

  if (isLoading) {
    return (
      <tr className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <td colSpan={table.getAllColumns().length}>
          <div className="flex h-full w-full items-center justify-center py-8">
            {customLoadingComponent || <Spinner />}
          </div>
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
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
            "border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
            getRowClassName(row.original),
            { "cursor-pointer hover:bg-gray-50": onRowClick },
          )}
          onClick={() => onRowClick?.(row.original)}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
