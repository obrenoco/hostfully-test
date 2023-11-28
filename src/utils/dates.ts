import moment, { Moment } from "moment";
import { BookingType, DateRange } from "../types/booking";

export function dateRangeToObject(dateRange: [moment.Moment, moment.Moment]) {
  const [startDate, endDate] = dateRange;
  const formattedStartDate = startDate.format("MM/DD/YYYY");
  const formattedEndDate = endDate.format("MM/DD/YYYY");

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

export const generateBlockedDates = (bookings: BookingType[]) => {
  const blockedDates: string[] = [];
  const today = moment().startOf("day");

  bookings.forEach((booking) => {
    const { startDate, endDate } = booking;
    const start = moment(startDate);
    const end = moment(endDate);

    while (start.isSameOrBefore(end)) {
      blockedDates.push(start.format("MM-DD-YYYY"));
      start.add(1, "day");
    }
  });

  return (date: Moment) => {
    const formattedDate = date.format("MM-DD-YYYY");
    return (
      moment(formattedDate).isBefore(today) ||
      blockedDates.includes(formattedDate)
    );
  };
};

export const isOverlapingWithBlockedDates = (
  dateRange: DateRange["dateRange"],
  bookingsArray: BookingType[]
): boolean => {
  const doDateRangesOverlap = (
    bookingA: { startDate: moment.Moment; endDate: moment.Moment },
    bookingB: BookingType
  ): boolean => {
    const startDateA = moment(bookingA.startDate);
    const endDateA = moment(bookingA.endDate);
    const startDateB = moment(bookingB.startDate);
    const endDateB = moment(bookingB.endDate);

    return (
      (startDateA.isSameOrBefore(endDateB) &&
        endDateA.isSameOrAfter(startDateB)) ||
      (startDateB.isSameOrBefore(endDateA) &&
        endDateB.isSameOrAfter(startDateA))
    );
  };

  const [start, end] = dateRange;
  const targetBooking = { startDate: start, endDate: end };

  return bookingsArray.some((booking) =>
    doDateRangesOverlap(targetBooking, booking)
  );
};
