"use client";

import useSWR from "swr";

import Spinner from "@/components/spinner/Spinner";
import { getProfile } from "@/libs/api/profile";

export default function Dashboard(): React.ReactNode {
  const { data, isLoading } = useSWR("/api/profile", getProfile);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8 xl:grid-cols-4">
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h5 className="font-roobert mb-2 text-sm font-bold tracking-widest text-gray-500 uppercase dark:text-white">
          Subscription
        </h5>
        {data?.currency ? (
          <p className="font-instrument py-2 text-right text-3xl font-normal text-wrap break-words text-gray-900 dark:text-gray-400">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: data.currency,
            })
              .format(9999999)
              .replace(data.currency, "")
              .trim()}
          </p>
        ) : (
          <p className="text-right font-normal text-gray-900 dark:text-gray-400">
            &#8212;
          </p>
        )}
        <p className="font-instrument text-right text-sm font-bold text-gray-500 dark:text-white">
          {data?.currency} / month
        </p>
      </div>
    </div>
  );
}
