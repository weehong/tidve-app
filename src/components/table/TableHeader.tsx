"use client";

import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import { TableHeaderProps } from "@/types/table";

export function TableHeader<TData>({
  table,
  stickyHeader,
  headerClassName,
}: TableHeaderProps<TData>): React.ReactNode {
  return (
    <thead
      className={classNames(
        "hidden bg-gray-50 text-xs text-gray-700 uppercase sm:table-header-group dark:bg-gray-700 dark:text-gray-400",
        { "sticky top-0": stickyHeader },
        headerClassName,
      )}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              onClick={() =>
                header.column.getCanSort() &&
                header.column.toggleSorting(
                  header.column.getIsSorted() === "asc",
                )
              }
            >
              <div className="flex w-max items-center gap-2">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getCanSort() && (
                  <>
                    {header.column.getIsSorted() === "asc" ? (
                      <ChevronUpIcon className="size-4" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ChevronDownIcon className="size-4" />
                    ) : (
                      <ChevronUpDownIcon className="size-4" />
                    )}
                  </>
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
