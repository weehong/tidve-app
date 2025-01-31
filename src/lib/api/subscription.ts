export const getSubscriptions = async () => {
  const res = await fetch("/api/subscription");

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return await res.json();
};
