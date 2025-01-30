"use client";

import { Profile } from "@prisma/client";
import { useAtomValue } from "jotai";

import { profileAtom } from "@/atom/userAtom";
import SubscriptionForm from "@/component/Form/Subscription/SubscriptionForm";

export default function Form() {
  const profile: Profile | null = useAtomValue(profileAtom);

  return <SubscriptionForm baseCurrency={{ currency: profile?.currency! }} />;
}
