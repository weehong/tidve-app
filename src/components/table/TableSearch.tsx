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
          className="block h-[38px] w-full rounded-md bg-white px-3 py-1.5 ps-10 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
