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
