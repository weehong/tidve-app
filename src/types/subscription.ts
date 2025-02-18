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

export type Episode = {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: number;
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  _links: {
    self: {
      href: string;
    };
    show: {
      href: string;
      name: string;
    };
  };
};

export type EpisodesResponse = Episode[];
