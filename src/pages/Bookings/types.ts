export type BookingType = {
  key: number;
  name: string;
  startDate: string;
  endDate: string;
  totalNights: number;
  totalPrice: number;
  dailyPrice: number;
  observations?: string;
  adults: number;
  kids: number;
  enfants: number;
  img: string;
};

export type DateRange = { dateRange: [moment.Moment, moment.Moment] };

export type DateFormatType = [
  `${string}-${string}-${string}`,
  `${string}-${string}-${string}`
];
