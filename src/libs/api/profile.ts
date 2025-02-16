import { Profile } from "@prisma/client";

export const getProfile = async (): Promise<Profile> => {
  const res = await fetch("/api/profile");

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await res.json();
};

export const updateBaseCurrency = async (
  currency: string,
  isInitial: boolean,
): Promise<Profile> => {
  const res = await fetch("/api/profile", {
    method: "POST",
    body: JSON.stringify({ currency, isInitial }),
  });

  if (!res.ok) {
    throw new Error("Failed to update base currency");
  }

  return await res.json();
};
