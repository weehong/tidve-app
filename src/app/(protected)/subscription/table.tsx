"use client";

import { useMemo, useState } from "react";

import { Rate, Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";

import SubscriptionForm from "@/app/(protected)/subscription/form";
import ActionDialog from "@/components/modal/ActionDialog";
import { DataTable } from "@/components/table/DataTable";
import { getExchangeRates } from "@/libs/api/rate";
import { deleteSubscription, getSubscriptions } from "@/libs/api/subscription";
import { convertBaseCurrency } from "@/libs/helper/currency-converter";
import { useCurrencyStore } from "@/store/profile";
import { useToastStore } from "@/store/toast";

export default function SubscriptionTable(): React.ReactNode {
  const { setIsOpen: setIsToastOpen, setMessage, setType } = useToastStore();
  const baseCurrency = useCurrencyStore((state) => state.baseCurrency);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    Subscription | undefined
  >(undefined);

  const { data: rates, isLoading: isRatesLoading } = useSWR<Rate[]>(
    "/api/rate",
    getExchangeRates,
  );

  const { data, isLoading, error, mutate } = useSWR<Subscription[]>(
    "/api/subscription",
    getSubscriptions,
  );

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 sm:table-cell">
            <span className="text-xl sm:text-sm">{getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex justify-between gap-1 sm:table-cell">
            <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
              Start Date
            </span>
            {new Date(getValue<string>()).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex justify-between gap-1 sm:table-cell">
            <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
              End Date
            </span>
            {new Date(getValue<string>()).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        accessorKey: "currency",
        header: "Price",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex justify-between gap-1 sm:table-cell">
            <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
              Price
            </span>
            <p className="flex flex-row-reverse items-center gap-2 text-sm font-medium sm:flex-row">
              <span className="text-sm">{row.original.currency}</span>
              <span className="text-sm">{row.original.price.toFixed(2)}</span>
            </p>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Converted Price",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex justify-between gap-1 sm:table-cell">
            <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
              Converted Price
            </span>
            <p className="flex flex-row-reverse items-center gap-2 text-sm font-medium sm:flex-row">
              <span className="text-sm">{baseCurrency}</span>
              <span className="text-sm">
                {convertBaseCurrency(
                  row.original.price,
                  row.original.currency,
                  baseCurrency || "USD",
                  rates || [],
                  {
                    decimalPlaces: 2,
                  },
                ).toFixed(2)}
              </span>
            </p>
          </div>
        ),
      },
      {
        accessorKey: "cycleInMonths",
        header: "Billing Cycle",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex justify-between gap-1 sm:table-cell">
            <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
              Billing Cycle
            </span>
            <span className="text-sm">{getValue<number>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-between gap-2 border-t border-gray-200 pt-2 sm:gap-0 sm:border-t-0 sm:border-none sm:pt-0">
            <button
              onClick={() => {
                setIsOpen(true);
                setSelectedSubscription(row.original);
              }}
              className="cursor-pointer px-3 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-600 sm:p-0"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setIsConfirmationOpen(true);
                setSelectedSubscription(row.original);
              }}
              className="cursor-pointer px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-600 sm:p-0"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [rates],
  );

  const handleDeleteSubscription = async () => {
    if (selectedSubscription?.id) {
      await deleteSubscription(selectedSubscription.id);
      setSelectedSubscription(undefined);
      setIsConfirmationOpen(false);
      setIsToastOpen(true);
      setMessage("The subscription has been deleted successfully.");
      setType("success");
      mutate();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ActionDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        onConfirm={handleDeleteSubscription}
        onConfirmButtonLabel="Delete"
        title="Delete Subscription"
        description="Are you sure you want to delete this subscription?"
        type="error"
      />
      <header className="flex items-center justify-between gap-6 px-4 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button
          onClick={() => {
            setIsOpen(true);
            setSelectedSubscription(undefined);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add Subscription
        </button>
      </header>
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading || isRatesLoading}
        error={error}
        onRefresh={mutate}
        searchPlaceholder="Search Subscription"
        enableSorting={true}
        enableGlobalFilter={true}
        stickyHeader={true}
        rowClassName="hover:bg-gray-50"
        headerClassName="bg-gray-100"
        enablePagination={true}
        defaultPageSize={10}
        defaultPageIndex={0}
        modalComponent={
          <>
            <SubscriptionForm
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              subscription={selectedSubscription}
              setSubscription={setSelectedSubscription}
              onCloseAction={() => {
                setSelectedSubscription(undefined);
              }}
            />
          </>
        }
      />
    </div>
  );
}
