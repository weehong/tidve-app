"use client";

import { Subscription } from "@prisma/client";
import { useAtom } from "jotai";
import useSWR from "swr";

import {
  getExchangeRates,
  getSubscriptions,
} from "@/app/(protected)/subscription/page";
import { profileAtom } from "@/atom/userAtom";
import { convertBaseCurrency, formatCurrencyAmount } from "@/lib/currency";

export default function CurrencyCard({
  title,
}: Readonly<{
  title: string;
}>) {
  const [profile] = useAtom(profileAtom);
  const { data: subscriptions, isLoading } = useSWR(
    "/api/subscription",
    getSubscriptions,
  );
  const { data: exchangeRates, isLoading: isExchangeRatesLoading } = useSWR(
    profile?.currency,
    getExchangeRates,
  );

  if (isLoading || isExchangeRatesLoading) return <div>Loading...</div>;

  const total = subscriptions.reduce(
    (acc: number, subscription: Subscription) => {
      return (
        acc +
        convertBaseCurrency(
          subscription.price / subscription.cycleInMonths,
          subscription.currency,
          profile?.currency!,
          exchangeRates,
        )
      );
    },
    0,
  );

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="flex flex-col items-end justify-end">
          <p className="font-roboto-mono text-2xl font-medium">
            {formatCurrencyAmount(total, profile?.currency!, "en-US")}
          </p>
          <span className="text-sm text-gray-500">month</span>
        </div>
      </div>
    </div>
  );
}
