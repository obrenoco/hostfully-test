import moment, { Moment } from "moment";
import { PostBookingType } from "../types/booking";

export function dateRangeToObject(dateRange: [moment.Moment, moment.Moment]) {
  const [startDate, endDate] = dateRange;
  const formattedStartDate = startDate.format("MM/DD/YYYY");
  const formattedEndDate = endDate.format("MM/DD/YYYY");

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export const calculateDaysDifference = (valueStr: string[]) => {
  const startDate = new Date(valueStr[0]);
  const endDate = new Date(valueStr[1]);
  const timeDifference = endDate.getTime() - startDate.getTime();
  return timeDifference / (1000 * 60 * 60 * 24);
};

export const generateBlockedDates = (bookings: PostBookingType[]) => {
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
  dateRange: [moment.Moment, moment.Moment],
  bookingsArray: PostBookingType[]
): boolean => {
  const doDateRangesOverlap = (
    bookingA: { startDate: moment.Moment; endDate: moment.Moment },
    bookingB: PostBookingType
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

const isOverlapWithArray = (
  dateRange: [string, string],
  bookingsArray: PostBookingType[]
): boolean => {
  const doDateRangesOverlap = (
    bookingA: PostBookingType,
    bookingB: PostBookingType
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
  const targetBooking = { startDate: start, endDate: end } as PostBookingType;

  return bookingsArray.some((booking) =>
    doDateRangesOverlap(targetBooking, booking)
  );
};
