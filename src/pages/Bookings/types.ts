export type GetBookings = {
  id: number;
  hostId: number;
  name: string;
  dailyPrice: number;
  totalPrice: number;
  img: string;
  startDate: string;
  adults: number;
  kids: number;
  enfants: number;
  endDate: string;
  totalNights: number;
  blockedDates: [string, string][];
  observations?: string;
};

export type PostBooking = {
  id: number;
  hostId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  adults: number;
  kids: number;
  enfants: number;
  observations?: string;
};

export type GetHosts = Pick<
  GetBookings,
  "hostId" | "name" | "dailyPrice" | "img" | "blockedDates"
>;

export type DateRange = { dateRange: [moment.Moment, moment.Moment] };

export type DateFormatType = [
  `${string}-${string}-${string}`,
  `${string}-${string}-${string}`
];

export enum NotificationType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}
