"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Rate, Subscription } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import useSWR from "swr";

import SubscriptionCard from "@/components/card/SubscriptionCard";
import CardSkeleton from "@/components/spinner/CardSkeleton";
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
  <p className={`flex items-center gap-2 font-medium ${className}`}>
    <span>{currency}</span>
    <span>{amount.toFixed(2)}</span>
  </p>
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
  } = useSWR("/api/subscription", () =>
    getSubscriptions({ page: 1, pageSize: -1 }),
  );

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

  const monthlyCommitments = useMemo(() => {
    if (!subscriptions?.length || !rates?.length || !profile?.currency) {
      return 0;
    }

    return subscriptions
      .filter((subscription) => subscription.cycleInMonths === 1)
      .reduce(
        (acc, subscription) =>
          acc +
          convertBaseCurrency(
            subscription.price,
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

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      return moment(a.endDate).diff(moment(b.endDate));
    });

    return sortedSubscriptions.filter((subscription) => {
      const endDate = moment(subscription.endDate);
      return endDate.isBetween(today, thirtyDaysFromNow, "day", "[)");
    });
  }, [subscriptions]);

  const amountToPayIn30Days = useMemo(() => {
    if (!expiringSubscriptions.length || !rates?.length || !profile?.currency) {
      return 0;
    }

    return expiringSubscriptions.reduce(
      (acc, subscription) =>
        acc +
        convertBaseCurrency(
          subscription.price,
          subscription.currency,
          profile.currency,
          rates,
        ),
      0,
    );
  }, [expiringSubscriptions, rates, profile?.currency]);

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 sm:table-cell">
            <span className="text-xl sm:text-base">{getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: "endDate",
        header: "Next Billing Date",
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          return (
            <div className="flex justify-between gap-1 sm:table-cell">
              <span className="text-gray-500 sm:hidden">Next Billing Date</span>
              <p className="text-right">
                {date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
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
              <span className="text-gray-500 sm:hidden">Price</span>
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
    <div className="grid grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
      <SubscriptionCard
        subscriptions={subscriptions || []}
        isSubscriptionsLoading={isSubscriptionsLoading}
        profile={profile || null}
        isProfileLoading={isProfileLoading}
        formattedTotal={formattedTotal}
        monthlyCommitments={monthlyCommitments}
        amountToPayIn30Days={amountToPayIn30Days}
      />

      <div className="col-span-4 mt-6">
        <div className="mb-4 flex flex-col justify-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">
            Upcoming Subscription Renewal in 30 Days
          </h2>
          <Link
            href="/subscription"
            className="text-sm font-bold text-indigo-500"
          >
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
        />
      </div>
    </div>
  );
}
