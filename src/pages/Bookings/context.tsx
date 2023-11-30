import { ReactNode, createContext, Dispatch } from "react";
import { useState } from "react";
import { GetBookings, GetHosts } from "./types";

export type BookingsContextType = {
  bookings: GetBookings[];
  hosts: GetHosts[];
  addBooking: (item: GetBookings) => void;
  updateBooking: (newItem: GetBookings) => void;
  deleteBooking: (index: number) => void;
  setBookings: Dispatch<React.SetStateAction<GetBookings[]>>;
  setHosts: Dispatch<React.SetStateAction<GetHosts[]>>;
};

export const BookingContext = createContext<BookingsContextType>({
  hosts: [],
  setHosts: () => {},
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

  return (
    <BookingContext.Provider
      value={{
        bookings,
        hosts,
        setHosts,
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
