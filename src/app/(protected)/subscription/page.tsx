"use client";

import { useState } from "react";

import Link from "next/link";

import { Profile, Subscription } from "@prisma/client";
import { useAtomValue } from "jotai";
import moment from "moment";
import useSWR from "swr";

import { profileAtom } from "@/atom/userAtom";
import DeleteDialog from "@/component/Dialog/DeleteDialog";
import { getExchangeRates } from "@/lib/api/currency";
import { getSubscriptions } from "@/lib/api/subscription";
import { convertBaseCurrency } from "@/lib/helper/currency";

export default function SubscriptionPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const profile: Profile | null = useAtomValue(profileAtom);

  const { data, isLoading, mutate } = useSWR(
    "/api/subscription",
    getSubscriptions,
  );
  const { data: exchangeRates, isLoading: isExchangeRatesLoading } = useSWR(
    "/api/exchange",
    getExchangeRates,
  );

  if (isLoading || isExchangeRatesLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Link
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          href="/subscription/create"
        >
          Create
        </Link>
      </div>
      <div className="mt-8 flow-root">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"></div>
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Next Payment Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Price in {profile?.currency}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Cycle
                <span className="block text-xs text-gray-500">Months</span>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              ></th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((subscription: Subscription) => (
                <tr key={subscription.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {moment(subscription.endDate).format("MMM DD, YYYY")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {subscription.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span className="mr-4 text-gray-500">
                        {subscription.currency}
                      </span>
                      <span className="text-gray-500">
                        {subscription.price.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span className="mr-4 text-gray-500">
                        {profile?.currency}
                      </span>
                      <span className="text-gray-500">
                        {convertBaseCurrency(
                          subscription.price,
                          subscription.currency,
                          profile?.currency!,
                          exchangeRates,
                          {
                            decimalPlaces: 2,
                          },
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                    {subscription.cycleInMonths}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="relative flex justify-end gap-2">
                      <Link
                        href={`/subscription/edit/${subscription.id}`}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Edit
                      </Link>
                      <button
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        Delete
                      </button>
                      {isDeleteModalOpen && (
                        <DeleteDialog
                          id={subscription.id}
                          mutate={mutate}
                          isOpen={isDeleteModalOpen}
                          setIsOpen={setIsDeleteModalOpen}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center text-gray-500">
                <td colSpan={7} className="py-8 text-center">
                  <p>No subscriptions found</p>
                  <br />
                  <p className="text-sm">
                    Click the Create button to add your first subscription
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
