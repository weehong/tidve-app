"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";

import { DataTable } from "@/components/table/DataTable";
import { fetcher } from "@/libs/api/subscription";
import { Episode } from "@/types/subscription";

export default function SubscriptionTable() {
  const { data, isLoading, error, mutate } = useSWR<Episode[]>(
    "https://api.tvmaze.com/shows/1/episodes",
    fetcher,
  );

  const columns = useMemo<ColumnDef<Episode>[]>(
    () => [
      { accessorKey: "id", header: "ID", enableSorting: true },
      { accessorKey: "name", header: "Name", enableSorting: true },
      { accessorKey: "season", header: "Season", enableSorting: true },
      { accessorKey: "number", header: "Episode", enableSorting: true },
      { accessorKey: "airdate", header: "Air Date", enableSorting: true },
      { accessorKey: "runtime", header: "Runtime", enableSorting: true },
      { accessorKey: "rating.average", header: "Rating", enableSorting: true },
      { accessorKey: "summary", header: "Summary" },
      {
        accessorKey: "image.medium",
        header: "Image",
        cell: ({ getValue }) => (
          <img src={getValue<string>()} alt="Episode" width={100} />
        ),
      },
      {
        accessorKey: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => <button>View</button>,
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      error={error}
      onRefresh={mutate}
      header="Subscription"
      searchPlaceholder="Search episodes..."
      enableSorting={true}
      enableGlobalFilter={true}
      stickyHeader={true}
      onRowClick={(row) => console.log("Clicked row:", row)}
      rowClassName="hover:bg-gray-50"
      headerClassName="bg-gray-100"
      enablePagination={true}
      defaultPageSize={10}
      defaultPageIndex={0}
    />
  );
}
