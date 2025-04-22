"use client";

import { useEffect, useRef, useState } from "react";
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
import Spinner from "@/components/spinner/Spinner";

export function DataTable<TData>({
  id,
  columns,
  data,
  isLoading = false,
  isLoadingMore = false,
  error = null,
  onRefresh,
  searchPlaceholder = "Search all columns...",
  enableSorting = true,
  enableGlobalFilter = true,
  stickyHeader = false,
  customLoadingComponent,
  customErrorComponent,
  onRowClick,
  rowClassName,
  wrapperClassName,
  headerClassName,
  tableClassName,
  modalComponent,
  onLoadMore,
  hasMore = false,
}: DataTableProps<TData>): React.ReactNode {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    columns,
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onGlobalFilterChange: setGlobalFilter,
    enableSorting,
    enableGlobalFilter,
  });

  useEffect(() => {
    const currentRef = wrapperRef.current;
    const handleScroll = () => {
      if (!currentRef || !onLoadMore || !hasMore || isLoading || isLoadingMore) return;

      const buffer = 200;
      const { scrollTop, scrollHeight, clientHeight } = currentRef;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < buffer;

      if (isNearBottom) {
        onLoadMore();
      }
    };

    currentRef?.addEventListener('scroll', handleScroll);
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore, isLoading, isLoadingMore]);

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
        ref={wrapperRef}
        className={classNames("relative flex-1 overflow-y-auto", wrapperClassName, {
          "overflow-x-auto": !isLoading,
        })}
      >
        <table
          id={id}
          className={classNames(
            "w-full text-left text-sm text-gray-500 rtl:text-right",
            tableClassName
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
              isLoadingMore={isLoadingMore}
              error={error}
              onRefresh={onRefresh}
              customLoadingComponent={customLoadingComponent}
              customErrorComponent={customErrorComponent}
              onRowClick={onRowClick}
              rowClassName={rowClassName}
            />

            {hasMore && (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="flex justify-center items-center gap-2">
                    {isLoadingMore ? (
                      <>
                        <Spinner className="h-5 w-5 text-gray-500 animate-spin" />
                        <span>Loading more subscriptions...</span>
                      </>
                    ) : (
                      <button
                        onClick={onLoadMore}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Load More
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}