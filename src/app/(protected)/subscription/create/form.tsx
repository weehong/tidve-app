"use client";

import { useAtomValue } from "jotai";
import useSWR from "swr";

import { profileAtom } from "@/atom/userAtom";
import SubscriptionForm from "@/component/Form/Subscription/SubscriptionForm";
import { getSubscription } from "@/lib/api/subscription";

export default function Form({ id }: { id?: number }) {
  const profile = useAtomValue(profileAtom);
  const { data: subscription, isLoading } = useSWR(
    id !== undefined ? `${id}` : null,
    getSubscription,
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SubscriptionForm
          baseCurrency={{ currency: profile?.currency! }}
          subscription={subscription}
        />
      )}
    </div>
  );
}
