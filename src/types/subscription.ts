export enum CycleType {
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM'
}

export type SubscriptionProps = {
  id: number;
  userId: string;
  name: string;
  currency: string;
  price: number;
  startDate: Date;
  endDate: Date;
  cycleType: CycleType;
  cycleInMonths: number;
  cycleDays?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
