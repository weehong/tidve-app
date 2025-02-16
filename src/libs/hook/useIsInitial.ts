import { Profile } from "@prisma/client";
import useSWR from "swr";

import { getProfile } from "@/libs/api/profile";

export function useIsInitial(): {
  profile: Profile | undefined;
  isInitial: boolean | undefined;
  currency: string | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useSWR("/api/profile", getProfile);

  return {
    profile: data,
    isInitial: data?.isInitial,
    currency: data?.currency,
    isLoading,
  };
}
