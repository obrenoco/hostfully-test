import moment from "moment";
import {
  calculateTotalNights,
  dateRangeToObject,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "./dates";
import { DateRange, GetBookings } from "../pages/Bookings/types";

describe("dateRangeToObject", () => {
  test("converts date range to object with formatted start and end dates", () => {
    const dateRange: DateRange["dateRange"] = [
      moment("2023-01-01"),
      moment("2023-01-05"),
    ];
    const result = dateRangeToObject(dateRange);

    expect(result.startDate).toBe("01-01-2023");
    expect(result.endDate).toBe("01-05-2023");
  });
});

describe("calculateTotalNights", () => {
  test("calculates total nights for a date range", () => {
    const dateRange: DateRange["dateRange"] = [
      moment("01-01-2023"),
      moment("01-05-2023"),
    ];
    const result = calculateTotalNights(dateRange);

    expect(result).toBe(4);
  });

  test("handles different date format", () => {
    const dateRange: DateRange["dateRange"] = [
      moment("2023-03-15"),
      moment("2023-03-20"),
    ];
    const result = calculateTotalNights(dateRange);

    expect(result).toBe(5);
  });

  test("handles single-day date range", () => {
    const dateRange: DateRange["dateRange"] = [
      moment("2023-06-05"),
      moment("2023-06-05"),
    ];
    const result = calculateTotalNights(dateRange);

    expect(result).toBe(0);
  });
});

describe("generateBlockedDates", () => {
  test("returns a function when bookings are provided", () => {
    const bookings: GetBookings["blockedDates"] = [
      ["01-01-2023", "01-03-2023"],
      ["01-10-2023", "01-15-2023"],
    ];
    const result = generateBlockedDates(bookings);

    expect(typeof result).toBe("function");
  });

  test("returns undefined when bookings are not provided", () => {
    const result = generateBlockedDates();

    expect(result).toBeUndefined();
  });

  test("blocks dates correctly based on provided bookings", () => {
    const bookings: GetBookings["blockedDates"] = [
      ["02-01-2024", "02-05-2024"],
      ["02-10-2024", "02-15-2024"],
    ];
    const blockedDatesFunction = generateBlockedDates(bookings)!;

    const blockedDate1 = blockedDatesFunction(moment("02-03-2024"));
    const blockedDate2 = blockedDatesFunction(moment("02-12-2024"));
    const unblockedDate = blockedDatesFunction(moment("02-08-2024"));

    expect(blockedDate1).toBe(true);
    expect(blockedDate2).toBe(true);
    expect(unblockedDate).toBe(false);
  });

  test("should block dates before the current day", () => {
    const blockedDates: GetBookings["blockedDates"] = [
      ["12-01-2023", "12-05-2023"],
      ["12-10-2023", "12-15-2023"],
    ];
    const blockedDatesFunction = generateBlockedDates(blockedDates)!;

    const unblockedDate = blockedDatesFunction(moment().subtract(1, "day"));
    expect(unblockedDate).toBe(true);
  });
});

describe("isOverlapingWithBlockedDates", () => {
  const mockBookingArray: GetBookings["blockedDates"] = [
    ["01-01-2023", "01-05-2023"],
    ["01-10-2023", "01-15-2023"],
    ["01-20-2023", "01-25-2023"],
  ];

  it("should detect overlapping date ranges", () => {
    const overlappingDateRange: DateRange["dateRange"] = [
      moment("01-03-2023"),
      moment("01-12-2023"),
    ];
    const isOverlapping = isOverlapingWithBlockedDates(
      overlappingDateRange,
      mockBookingArray
    );
    expect(isOverlapping).toBe(true);
  });

  it("should not detect overlap with non-overlapping date ranges", () => {
    const nonOverlappingDateRange: DateRange["dateRange"] = [
      moment("02-01-2023"),
      moment("02-05-2023"),
    ];
    const isOverlapping = isOverlapingWithBlockedDates(
      nonOverlappingDateRange,
      mockBookingArray
    );
    expect(isOverlapping).toBe(false);
  });

  it("should handle date range exactly matching a blocked date range", () => {
    const matchingDateRange: DateRange["dateRange"] = [
      moment("01-20-2023"),
      moment("01-25-2023"),
    ];
    const isOverlapping = isOverlapingWithBlockedDates(
      matchingDateRange,
      mockBookingArray
    );
    expect(isOverlapping).toBe(true);
  });
});
