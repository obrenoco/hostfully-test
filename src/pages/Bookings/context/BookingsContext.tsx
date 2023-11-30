import { ReactNode, createContext, Dispatch } from "react";
import { useState } from "react";
import { GetBookings } from "../api";

export type BookingsContextType = {
  bookings: GetBookings[];
  addBooking: (item: GetBookings) => void;
  updateBooking: (newItem: GetBookings) => void;
  deleteBooking: (index: number) => void;
  setBookings: Dispatch<React.SetStateAction<GetBookings[]>>;
};

export const BookingContext = createContext<BookingsContextType>({
  bookings: [],
  addBooking: () => {},
  updateBooking: () => {},
  deleteBooking: () => {},
  setBookings: () => {},
});

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<GetBookings[]>([]);

  const addBooking: BookingsContextType["addBooking"] = (item) =>
    setBookings((prevBookings) => [...prevBookings, item]);

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

      console.log(updatedBookings);

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
