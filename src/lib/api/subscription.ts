import { Subscription } from "@prisma/client";

export const getSubscriptions = async () => {
  const res = await fetch("/api/subscription");

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return await res.json();
};

export const getSubscription = async (id?: number) => {
  if (!id) {
    return null;
  }

  const res = await fetch(`/api/subscription/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch subscription");
  }

  return await res.json();
};

export const editSubscription = async (id: number, data: Subscription) => {
  const res = await fetch(`/api/subscription/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to edit subscription");
  }

  return await res.json();
};

export const deleteSubscription = async (id: number) => {
  const res = await fetch(`/api/subscription/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete subscription");
  }

  return await res.json();
};
