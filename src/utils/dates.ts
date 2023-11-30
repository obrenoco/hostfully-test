import moment, { Moment } from "moment";
import { DateRange, GetBookings } from "../pages/Bookings/types";

export const dateFormat = "MM/DD/YYYY";

export function dateRangeToObject(dateRange: [moment.Moment, moment.Moment]) {
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
    const start = moment(startDate, dateFormat);
    const end = moment(endDate, dateFormat);

    while (start.isSameOrBefore(end)) {
      blockedDates.push(start.format("MM-DD-YYYY"));
      start.add(1, "day");
    }
  });

  return (date: Moment) => {
    const formattedDate = date.format("MM-DD-YYYY");
    return (
      moment(formattedDate, dateFormat).isBefore(today) ||
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
    const startDateA = moment(bookingA.startDate, dateFormat);
    const endDateA = moment(bookingA.endDate, dateFormat);
    const startDateB = moment(bookingB[0], dateFormat);
    const endDateB = moment(bookingB[1], dateFormat);

    return (
      (startDateA.isSameOrBefore(endDateB) &&
        endDateA.isSameOrAfter(startDateB)) ||
      (startDateB.isSameOrBefore(endDateA) &&
        endDateB.isSameOrAfter(startDateA))
    );
  };

  const [start, end] = dateRange;
  const targetBooking = {
    startDate: moment(start, dateFormat),
    endDate: moment(end, dateFormat),
  };

  return bookingsArray.some((booking) =>
    doDateRangesOverlap(targetBooking, booking)
  );
};
