"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { TableSearchProps } from "@/types/table";

export function TableSearch({
  globalFilter,
  setGlobalFilter,
  searchPlaceholder,
}: TableSearchProps): React.ReactNode {
  return (
    <form className="flex items-center">
      <label htmlFor="voice-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <MagnifyingGlassIcon className="size-4 text-gray-500" />
        </div>
        <input
          type="text"
          id="voice-search"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
          placeholder={searchPlaceholder}
          required
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        {globalFilter && (
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
            onClick={() => {
              setGlobalFilter("");
            }}
          >
            <XMarkIcon className="size-4 text-gray-500" />
          </button>
        )}
      </div>
    </form>
  );
}
