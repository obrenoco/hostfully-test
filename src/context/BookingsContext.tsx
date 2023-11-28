import { ReactNode, createContext } from "react";
import { useState } from "react";
import { dateRangeToObject } from "../utils/dates";
import { PostBookingType } from "../types/booking";

const dataSource: PostBookingType[] = [
  {
    key: 1,
    name: "Cabo Frio - 3 bedroom",
    startDate: "12/01/2023",
    endDate: "12/02/2023",
    price: 150,
    adults: 2,
    kids: 3,
    enfants: 1,
    currency: "EUR",
  },
  {
    key: 2,
    name: "Cape Town with amazing view",
    startDate: "12/12/2023",
    endDate: "12/15/2023",
    price: 450,
    adults: 4,
    kids: 0,
    img: "https://a.cdn-hotels.com/gdcs/production67/d440/98ce2718-e399-48d7-867e-5a49a19d87f3.jpg",
    enfants: 1,
    currency: "USD",
    observations:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
];

export type BookingsContextType = {
  bookings: PostBookingType[];
  addBooking: (item: PostBookingType) => void;
  updateBooking: (newItem: PostBookingType) => void;
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
    setBookings((prevBooking: PostBookingType[]) =>
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
