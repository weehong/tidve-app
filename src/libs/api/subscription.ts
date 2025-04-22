import { PaginatedResponse } from "@/types/subscription";
import { Subscription } from "@prisma/client";

export const getSubscriptions = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse> => {
  const response = await fetch(`/api/subscription?page=${page}&pageSize=${pageSize}`);

  if (!response.ok) {
    console.error("Failed to fetch subscriptions");
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export const getSubscription = async (id: number): Promise<Subscription> => {
  const response = await fetch(`/api/subscription/${id}`);

  if (!response.ok) {
    console.error("Failed to fetch subscription");
    throw new Error("Failed to fetch data");
  }

  return await response.json();
};

export const createSubscription = async (
  subscription: Omit<
    Subscription,
    "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
  >,
): Promise<Subscription> => {
  const response = await fetch("/api/subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    console.error("Failed to create subscription");
    throw new Error("Failed to create data");
  }

  return response.json();
};

export const updateSubscription = async (
  id: number,
  subscription: Omit<
    Subscription,
    "id" | "createdAt" | "updatedAt" | "userId" | "isActive"
  >,
): Promise<Subscription> => {
  const response = await fetch(`/api/subscription/${id}`, {
    method: "PUT",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    console.error("Failed to update subscription");
    throw new Error("Failed to update data");
  }

  return response.json();
};

export const deleteSubscription = async (id: number): Promise<void> => {
  const response = await fetch(`/api/subscription/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Failed to delete subscription");
    throw new Error("Failed to delete data");
  }

  return response.json();
};