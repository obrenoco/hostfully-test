import moment, { Moment } from "moment";
import { DateRange, GetBookings } from "../pages/Bookings/types";

export const calendarDateFormat = "MM/DD/YYYY";

export function dateRangeToObject(dateRange: DateRange["dateRange"]) {
  const [startDate, endDate] = dateRange;
  const formattedStartDate = startDate.format("MM-DD-YYYY");
  const formattedEndDate = endDate.format("MM-DD-YYYY");

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export const calculateTotalNights = (valueStr: DateRange["dateRange"]) => {
  const startDate = new Date(valueStr[0].toDate());
  const endDate = new Date(valueStr[1].toDate());
  const timeDifference = endDate.getTime() - startDate.getTime();
  return timeDifference / (1000 * 60 * 60 * 24);
};

export const generateBlockedDates = (
  bookings?: GetBookings["blockedDates"]
) => {
  if (!bookings) return;
  const blockedDates: string[] = [];
  const today = moment().startOf("day");

  bookings.forEach((booking) => {
    const [startDate, endDate] = booking;
    const start = moment(startDate, calendarDateFormat);
    const end = moment(endDate, calendarDateFormat);

    while (start.isSameOrBefore(end)) {
      blockedDates.push(start.format("MM-DD-YYYY"));
      start.add(1, "day");
    }
  });

  return (date: Moment) => {
    const formattedDate = date.format("MM-DD-YYYY");
    return (
      moment(formattedDate, calendarDateFormat).isBefore(today) ||
      blockedDates.includes(formattedDate)
    );
  };
};

export const isOverlapingWithBlockedDates = (
  dateRange: DateRange["dateRange"],
  bookingsArray: [string, string][]
): boolean => {
  const doDateRangesOverlap = (
    bookingA: { startDate: moment.Moment; endDate: moment.Moment },
    bookingB: [string, string]
  ): boolean => {
    const startDateA = moment(bookingA.startDate, calendarDateFormat);
    const endDateA = moment(bookingA.endDate, calendarDateFormat);
    const startDateB = moment(bookingB[0], calendarDateFormat);
    const endDateB = moment(bookingB[1], calendarDateFormat);

    return (
      (startDateA.isSameOrBefore(endDateB) &&
        endDateA.isSameOrAfter(startDateB)) ||
      (startDateB.isSameOrBefore(endDateA) &&
        endDateB.isSameOrAfter(startDateA))
    );
  };

  const [start, end] = dateRange;
  const targetBooking = {
    startDate: moment(start, calendarDateFormat),
    endDate: moment(end, calendarDateFormat),
  };

  return bookingsArray.some((booking) =>
    doDateRangesOverlap(targetBooking, booking)
  );
};
