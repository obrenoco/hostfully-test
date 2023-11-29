import { ReactNode, createContext, Dispatch } from "react";
import { useState } from "react";
import { dateRangeToObject } from "../../../utils/dates";
import { BookingType, DateRange } from "../types/booking";

export type BookingsContextType = {
  bookings: BookingType[];
  addBooking: (item: BookingType) => void;
  updateBooking: (newItem: BookingType & DateRange) => void;
  deleteBooking: (index: number) => void;
  setBookings: Dispatch<React.SetStateAction<BookingType[]>>;
};

export const BookingContext = createContext<BookingsContextType>({
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  deleteBooking: () => {},
  setBookings: () => {},
});

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<BookingType[]>([]);

  const addBooking: BookingsContextType["addBooking"] = (item) =>
    setBookings((prevTreasure) => [...prevTreasure, item]);

  const updateBooking: BookingsContextType["updateBooking"] = (newItem) => {
    const newDateRange = dateRangeToObject(newItem.dateRange!);
    setBookings((prevBookings) => {
      const updatedBookings = prevBookings.map((booking) => {
        return booking.key === newItem.key
          ? {
              ...newItem,
              startDate: newDateRange!.startDate,
              endDate: newDateRange!.endDate,
            }
          : booking;
      });
      return updatedBookings;
    });
  };

  const deleteBooking: BookingsContextType["deleteBooking"] = (key) =>
    setBookings((prevBooking: BookingType[]) =>
      [...prevBooking].filter((i) => i.key !== key)
    );
  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        setBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
