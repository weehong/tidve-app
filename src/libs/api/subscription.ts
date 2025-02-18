import { Subscription } from "@prisma/client";

export const fetcher = async (url: string): Promise<Subscription> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
