"use client";

import { useState } from "react";

import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

import { TableBody } from "@/components/table/TableBody";
import { fuzzyFilter } from "@/components/table/TableFilter";
import { TableHeader } from "@/components/table/TableHeader";
import { TableSearch } from "@/components/table/TableSearch";
import { DataTableProps } from "@/types/table";

export function DataTable<TData>({
  id,
  columns,
  data,
  isLoading = false,
  error = null,
  onRefresh,
  searchPlaceholder = "Search all columns...",
  enableSorting = true,
  enableGlobalFilter = true,
  enableColumnFilters = false,
  stickyHeader = false,
  customLoadingComponent,
  customErrorComponent,
  onRowClick,
  rowClassName,
  wrapperClassName,
  headerClassName,
  tableClassName,
  modalComponent,
}: DataTableProps<TData>): React.ReactNode {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const processedColumns = columns.map((column) => ({
    ...column,
    enableSorting: enableSorting && column.enableSorting !== false,
    enableFiltering: enableGlobalFilter && column.enableGlobalFilter !== false,
  }));

  const table = useReactTable({
    columns: processedColumns,
    data,
    state: {
      sorting,
      globalFilter: enableGlobalFilter ? globalFilter : "",
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel:
      enableGlobalFilter || enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onGlobalFilterChange: setGlobalFilter,
    enableSorting,
    enableGlobalFilter,
    enableColumnFilters,
    manualPagination: false,
  });

  return (
    <div className="flex h-full flex-col gap-6">
      {enableGlobalFilter && (
        <div className="px-4 sm:px-6 lg:px-8">
          <TableSearch
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      )}

      {modalComponent}

      <div
        className={classNames("relative flex-1", wrapperClassName, {
          "overflow-x-auto": !isLoading,
        })}
      >
        <table
          id={id}
          className={classNames(
            "w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400",
            tableClassName,
          )}
        >
          <TableHeader
            table={table}
            stickyHeader={stickyHeader}
            headerClassName={headerClassName}
          />
          <tbody className="flex flex-col gap-4 sm:table-row-group">
            <TableBody
              table={table}
              isLoading={isLoading}
              error={error}
              onRefresh={onRefresh}
              customLoadingComponent={customLoadingComponent}
              customErrorComponent={customErrorComponent}
              onRowClick={onRowClick}
              rowClassName={rowClassName}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
