import React, { ReactNode, createContext } from "react";
import { useState } from "react";
import { DataType } from "../Bookings";
import { dateRangeToObject } from "../../../utils/dates";

const dataSource: DataType[] = [
  {
    key: 1,
    name: "Paul and Mary",
    startDate: "12/01/2024",
    endDate: "12/30/2024",
    guests: 5,
    price: 140,
  },
  {
    key: 2,
    name: "Breno e Bruna",
    startDate: "02/12/2023",
    endDate: "12/12/2023",
    guests: 8,
    price: 200,
    observations:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
];

export type BookingsContextType = {
  bookings: DataType[];
  addBooking: (item: DataType) => void;
  updateBooking: (newItem: DataType) => void;
  deleteBooking: (index: number) => void;
};

export const BookingContext = createContext<BookingsContextType>({
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  deleteBooking: () => {},
});

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState(dataSource);

  const addBooking: BookingsContextType["addBooking"] = (item) =>
    setBookings((prevTreasure) => [...prevTreasure, item]);

  const updateBooking: BookingsContextType["updateBooking"] = (newItem) => {
    const newDateRange = dateRangeToObject(newItem.dateRange);
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

  const deleteBooking: BookingsContextType["deleteBooking"] = (key) => {
    setBookings((prevBooking: DataType[]) =>
      [...prevBooking].filter((i) => i.key !== key)
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
