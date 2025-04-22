import { Subscription } from "@prisma/client";

export type PaginatedResponse = {
  data: Subscription[];
  hasMore: boolean;
};

export type SubscriptionProps = {
  id: number;
  userId: string;
  name: string;
  currency: string;
  price: number;
  startDate: Date;
  endDate: Date;
  cycleInMonths: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
