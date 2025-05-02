import { Profile, Subscription } from "@prisma/client";
import moment from "moment";

import CardSkeleton from "../spinner/CardSkeleton";
import Skeleton from "../spinner/Skeleton";

type SubscriptionCardProps = {
  subscriptions: Subscription[];
  isSubscriptionsLoading: boolean;
  profile: Profile | null;
  isProfileLoading: boolean;
  formattedTotal: string;
  monthlyCommitments: number;
  expiringThisMonth: Subscription[];
  expiringThisMonthTotal: number;
};

export default function SubscriptionCard({
  subscriptions,
  isSubscriptionsLoading,
  profile,
  isProfileLoading,
  formattedTotal,
  monthlyCommitments,
  expiringThisMonth,
  expiringThisMonthTotal,
}: SubscriptionCardProps): React.ReactNode {
  if (isSubscriptionsLoading || isProfileLoading) {
    return <CardSkeleton />;
  }

  const formattedMonthlyCommitments = profile?.currency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: profile.currency,
      })
        .format(monthlyCommitments)
        .replace(profile.currency, "")
        .trim()
    : "";

  const formattedExpiringTotal = profile?.currency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: profile.currency,
      })
        .format(expiringThisMonthTotal)
        .replace(profile.currency, "")
        .trim()
    : "";

  const calculatedMonthlySubscriptions = subscriptions.filter((subscription) =>
    moment(subscription.startDate).isSame(moment(), "month"),
  ).length;

  return (
    <div className="col-span-4 rounded-lg bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 flex-col justify-between gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Expiring This Month
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formattedExpiringTotal}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {expiringThisMonth.length} subscription(s)
          </p>
        </div>

        <div className="block h-full w-px sm:hidden" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Commitments
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formattedMonthlyCommitments}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {calculatedMonthlySubscriptions} subscription(s)
          </p>
        </div>

        <div className="block h-full w-px sm:hidden" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Total Commitments
            <span className="block text-xs font-normal text-gray-400">
              Per Month
            </span>
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formattedTotal}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {subscriptions.length} subscription(s)
          </p>
        </div>
      </div>
    </div>
  );
}
