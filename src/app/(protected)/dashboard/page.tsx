"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Rate, Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import useSWR from "swr";

import Skeleton from "@/components/spinner/Skeleton";
import { DataTable } from "@/components/table/DataTable";
import { getProfile } from "@/libs/api/profile";
import { getExchangeRates } from "@/libs/api/rate";
import { getSubscriptions } from "@/libs/api/subscription";
import { convertBaseCurrency } from "@/libs/helper/currency-converter";

type CurrencyDisplayProps = {
  amount: number;
  currency: string;
  className?: string;
};

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  className = "",
}): React.ReactNode => (
  <p className={`flex items-center gap-2 text-sm font-medium ${className}`}>
    <span>{currency}</span>
    <span>{amount.toFixed(2)}</span>
  </p>
);

const LoadingSkeleton: React.FC = (): React.ReactNode => (
  <div className="flex items-center gap-2">
    <Skeleton className="my-2 h-9 w-full" />
  </div>
);

export default function Dashboard(): React.ReactNode {
  const { data: profile, isLoading: isProfileLoading } = useSWR(
    "/api/profile",
    getProfile,
  );

  const {
    data: subscriptions,
    isLoading: isSubscriptionsLoading,
    error,
  } = useSWR("/api/subscription", getSubscriptions);

  const { data: rates } = useSWR<Rate[]>("/api/rate", getExchangeRates);

  const total = useMemo(() => {
    if (!subscriptions?.length || !rates?.length || !profile?.currency) {
      return 0;
    }

    return subscriptions.reduce(
      (acc, subscription) =>
        acc +
        convertBaseCurrency(
          subscription.price / subscription.cycleInMonths,
          subscription.currency,
          profile.currency,
          rates,
        ),
      0,
    );
  }, [subscriptions, rates, profile?.currency]);

  const expiringSubscriptions = useMemo(() => {
    if (!subscriptions?.length) return [];

    const today = moment().startOf("day");
    const thirtyDaysFromNow = moment().add(30, "days").endOf("day");

    return subscriptions.filter((subscription) => {
      const endDate = moment(subscription.endDate);
      return endDate.isBetween(today, thirtyDaysFromNow, "day", "[)");
    });
  }, [subscriptions]);

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
        accessorKey: "endDate",
        header: "End Date",
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          return (
            <div className="flex justify-between gap-1 sm:table-cell">
              <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
                End Date
              </span>
              {date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Converted Price",
        enableSorting: true,
        cell: ({ row }) => {
          const convertedPrice =
            rates && profile?.currency
              ? convertBaseCurrency(
                  row.original.price,
                  row.original.currency,
                  profile.currency,
                  rates,
                  { decimalPlaces: 2 },
                )
              : 0;

          return (
            <div className="flex justify-between gap-1 sm:table-cell">
              <span className="text-sm text-gray-500 sm:hidden sm:text-xs">
                Price
              </span>
              <CurrencyDisplay
                amount={convertedPrice}
                currency={profile?.currency || "USD"}
                className="flex-row-reverse sm:flex-row"
              />
            </div>
          );
        },
      },
    ],
    [rates, profile?.currency],
  );

  const formattedTotal = useMemo(() => {
    if (!profile?.currency) return "";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: profile.currency,
    })
      .format(total)
      .replace(profile.currency, "")
      .trim();
  }, [total, profile?.currency]);

  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
      <div className="col-span-4 block rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1 dark:border-gray-700 dark:bg-gray-800">
        <h5 className="font-roobert mb-2 text-sm font-bold tracking-widest text-gray-500 uppercase dark:text-white">
          Subscription
        </h5>

        {isSubscriptionsLoading ? (
          <LoadingSkeleton />
        ) : profile ? (
          <p className="font-instrument py-2 text-right text-3xl font-normal text-wrap break-words text-gray-900 dark:text-gray-400">
            {formattedTotal}
          </p>
        ) : (
          <p className="text-right font-normal text-gray-900 dark:text-gray-400">
            &#8734;
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="font-instrument text-sm font-bold text-gray-500 dark:text-white">
            <p>{subscriptions?.length} Subscriptions</p>
          </div>
          <div className="font-instrument flex items-center justify-end gap-1 text-right text-sm font-bold text-gray-500 dark:text-white">
            {isProfileLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <p className="text-gray-900 dark:text-gray-400">
                {profile?.currency || <span>&#8212;</span>}
              </p>
            )}
            <p className="text-gray-500 dark:text-gray-400">/</p>
            <p className="text-gray-500 dark:text-gray-400">month</p>
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Subscriptions Expiring In 30 Days
          </h2>
          <Link href="/subscription" className="font-bold text-indigo-500">
            View All
          </Link>
        </div>
        <DataTable
          id="dashboard-subscription-table"
          columns={columns}
          data={expiringSubscriptions}
          isLoading={isSubscriptionsLoading}
          error={error}
          searchPlaceholder="Search Subscription"
          enableSorting={false}
          enableGlobalFilter={false}
          stickyHeader={true}
          rowClassName="hover:bg-gray-50"
          headerClassName="bg-gray-100"
          enablePagination={false}
          defaultPageSize={10}
          defaultPageIndex={0}
        />
      </div>
    </div>
  );
}
