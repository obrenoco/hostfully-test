export type PostBookingType = {
  key: number;
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  observations?: string;
  dateRange?: [moment.Moment, moment.Moment];
  adults: number;
  kids: number;
  enfants: number;
  img?: string;
};

export type GetBookingType = {};
