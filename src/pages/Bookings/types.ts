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

export enum BookingsFormFields {
  Id = "id",
  Name = "name",
  Image = "img",
  Adults = "adults",
  Kids = "kids",
  Enfants = "enfants",
  DateRange = "dateRange",
  TotalNights = "totalNights",
  DailyPrice = "dailyPrice",
  TotalPrice = "totalPrice",
  Observations = "observations",
  BlockedDates = "blockedDates",
  HostId = "hostId",
}

export type BookingsFormTypes = {
  [BookingsFormFields.Id]: GetBookings["id"];
  [BookingsFormFields.Name]: GetBookings["name"] | GetHosts["name"];
  [BookingsFormFields.Image]: GetBookings["img"] | GetHosts["img"];
  [BookingsFormFields.Adults]: GetBookings["adults"] | PostBooking["adults"];
  [BookingsFormFields.Kids]: GetBookings["kids"] | PostBooking["kids"];
  [BookingsFormFields.Enfants]: GetBookings["enfants"] | PostBooking["enfants"];
  [BookingsFormFields.DateRange]: DateRange["dateRange"];
  [BookingsFormFields.TotalNights]: GetBookings["totalNights"];
  [BookingsFormFields.DailyPrice]:
    | GetBookings["dailyPrice"]
    | GetHosts["dailyPrice"];
  [BookingsFormFields.TotalPrice]:
    | GetBookings["totalPrice"]
    | PostBooking["totalPrice"];
  [BookingsFormFields.Observations]: PostBooking["observations"];
  [BookingsFormFields.BlockedDates]:
    | GetBookings["blockedDates"]
    | GetHosts["blockedDates"];
};
