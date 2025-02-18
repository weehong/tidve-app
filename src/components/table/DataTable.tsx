"use client";

import { useEffect, useState } from "react";

import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

import { TableBody } from "@/components/table/TableBody";
import { fuzzyFilter } from "@/components/table/TableFilter";
import { TableHeader } from "@/components/table/TableHeader";
import { TablePagination } from "@/components/table/TablePagination";
import { TableSearch } from "@/components/table/TableSearch";
import { DataTableProps } from "@/types/table";

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  error = null,
  onRefresh,
  header,
  searchPlaceholder = "Search all columns...",
  enableSorting = true,
  enableGlobalFilter = true,
  enableColumnFilters = false,
  enablePagination = false,
  defaultPageSize = 20,
  defaultPageIndex = 0,
  stickyHeader = false,
  customLoadingComponent,
  customErrorComponent,
  onRowClick,
  rowClassName,
  headerClassName,
  tableClassName,
}: DataTableProps<TData> & {
  enablePagination?: boolean;
  defaultPageSize?: number;
  defaultPageIndex?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });

  useEffect(() => {
    if (enableGlobalFilter) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [globalFilter, enableGlobalFilter]);

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
      pagination: enablePagination ? { pageIndex, pageSize } : undefined,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel:
      enableGlobalFilter || enableColumnFilters
        ? getFilteredRowModel()
        : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    onGlobalFilterChange: setGlobalFilter,
    enableSorting,
    enableGlobalFilter,
    enableColumnFilters,
    manualPagination: false,
  });

  return (
    <div className="flex flex-col gap-6">
      {header && <h1 className="text-2xl font-bold">{header}</h1>}

      {enableGlobalFilter && (
        <TableSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
        />
      )}

      <div
        className={classNames("relative", { "overflow-x-auto": !isLoading })}
      >
        <table
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
          <tbody>
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

      {enablePagination && (
        <TablePagination table={table} pageSize={pageSize} data={data} />
      )}
    </div>
  );
}
