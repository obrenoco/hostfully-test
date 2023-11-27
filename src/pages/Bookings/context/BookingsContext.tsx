import { ReactNode, createContext } from "react";
import { useState } from "react";
import { BookingType } from "../Bookings";
import { dateRangeToObject } from "../../../utils/dates";

const dataSource: BookingType[] = [
  {
    key: 1,
    name: "Paul and Mary",
    startDate: "12/01/2024",
    endDate: "12/02/2024",
    price: 150,
    adults: 2,
    kids: 3,
    enfants: 1,
    currency: "EUR",
  },
  {
    key: 2,
    name: "Breno e Bruna",
    startDate: "02/12/2023",
    endDate: "02/15/2023",
    price: 450,
    adults: 4,
    enfants: 1,
    currency: "USD",
    observations:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
];

export type BookingsContextType = {
  bookings: BookingType[];
  addBooking: (item: BookingType) => void;
  updateBooking: (newItem: BookingType) => void;
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
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
