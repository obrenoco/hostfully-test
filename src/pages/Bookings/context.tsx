import { ReactNode, createContext, Dispatch } from "react";
import { useState } from "react";
import { GetBookings, GetHosts } from "./types";

export type BookingsContextType = {
  bookings: GetBookings[];
  hosts: GetHosts[];
  updateHost: (newItem: GetHosts) => void;
  addBooking: (item: GetBookings) => void;
  updateBooking: (newItem: GetBookings) => void;
  deleteBooking: (index: number) => void;
  setBookings: Dispatch<React.SetStateAction<GetBookings[]>>;
  setHosts: Dispatch<React.SetStateAction<GetHosts[]>>;
};

export const BookingContext = createContext<BookingsContextType>({
  hosts: [],
  setHosts: () => {},
  updateHost: () => {},
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  deleteBooking: () => {},
  setBookings: () => {},
});

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<GetBookings[]>([]);
  const [hosts, setHosts] = useState<GetHosts[]>([]);

  const addBooking: BookingsContextType["addBooking"] = (item) =>
    setBookings((prevBookings) => {
      console.log(item);

      return [...prevBookings, item];
    });

  const updateBooking: BookingsContextType["updateBooking"] = (newItem) => {
    setBookings((prevBookings) => {
      const updatedBookings: GetBookings[] = prevBookings.map((prev) => {
        return prev.id === newItem.id
          ? {
              ...newItem,
              id: Math.floor(Math.random() * 10 ** 10),
            }
          : prev;
      });

      return updatedBookings;
    });
  };

  const deleteBooking: BookingsContextType["deleteBooking"] = (key) =>
    setBookings((prevBooking) =>
      [...prevBooking].filter((prev) => prev.id !== key)
    );

  const updateHost: BookingsContextType["updateHost"] = (newItem) => {
    setHosts((prevHosts) => {
      const updatedHost: GetHosts[] = prevHosts.map((prev) => {
        console.log(prev);

        return JSON.stringify(prev) === JSON.stringify(newItem)
          ? prev
          : newItem;
      });

      return updatedHost;
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        hosts,
        setHosts,
        addBooking,
        updateBooking,
        deleteBooking,
        updateHost,
        setBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
