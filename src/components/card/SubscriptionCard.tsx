import { Profile, Subscription } from "@prisma/client";
import moment from "moment";

import CardSkeleton from "../spinner/CardSkeleton";

type SubscriptionCardProps = {
  subscriptions: Subscription[];
  isSubscriptionsLoading: boolean;
  profile: Profile | null;
  isProfileLoading: boolean;
  formattedTotal: string;
  monthlyCommitments: number;
  amountToPayIn30Days: number;
};

export default function SubscriptionCard({
  subscriptions,
  isSubscriptionsLoading,
  profile,
  isProfileLoading,
  formattedTotal,
  monthlyCommitments,
  amountToPayIn30Days,
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

  const formattedAmountToPayIn30Days = profile?.currency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: profile.currency,
      })
        .format(amountToPayIn30Days)
        .replace(profile.currency, "")
        .trim()
    : "";

  const calculatedMonthlySubscriptions = subscriptions.filter(
    (subscription) => subscription.cycleInMonths === 1,
  ).length;

  return (
    <div className="col-span-4 rounded-lg bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 flex-col justify-between gap-4 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Due in 30 Days
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formattedAmountToPayIn30Days}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {
              subscriptions.filter((sub) =>
                moment(sub.endDate).isBetween(
                  moment(),
                  moment().add(30, "days"),
                  "day",
                  "[)",
                ),
              ).length
            }{" "}
            subscription(s)
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
