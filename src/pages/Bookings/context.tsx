import { ReactNode, createContext, Dispatch } from "react";
import { useState } from "react";
import { DateRange, GetBookings, GetHosts } from "./types";
import { generateRandomNumberId } from "../../utils/numbers";

export type BookingsContextType = {
  bookings: GetBookings[];
  hosts: GetHosts[];
  updateHost: (newItem: GetHosts) => void;
  addBooking: (item: GetBookings) => void;
  updateBooking: (newItem: GetBookings & DateRange) => void;
  deleteBooking: (newItem: GetBookings) => void;
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
    setBookings((prevBookings) => [...prevBookings, item]);

  const updateBooking: BookingsContextType["updateBooking"] = (booking) => {
    const oldBooking = bookings.find((item) => booking.id === item.id)!;
    const currentHost = hosts.find((host) => host.hostId === booking.hostId)!;

    if (
      oldBooking.startDate !== booking.startDate &&
      oldBooking.endDate !== booking.endDate
    ) {
      setHosts((prevHosts) => {
        const modifiedBlockedDates: GetHosts["blockedDates"] =
          currentHost.blockedDates.map((blockedDate) =>
            JSON.stringify(blockedDate) ===
            JSON.stringify([oldBooking.startDate, oldBooking.endDate])
              ? [booking.startDate, booking.endDate]
              : blockedDate
          );
        const newHost = { ...currentHost, blockedDates: modifiedBlockedDates };
        const modifiedHost = prevHosts.map((prevHost) =>
          prevHost.hostId === newHost.hostId ? newHost : prevHost
        );
        return modifiedHost;
      });
    }

    setBookings((prevBookings) => {
      const updatedBookings: GetBookings[] = prevBookings.map((prev) =>
        prev.id === booking.id
          ? {
              ...booking,
              id: generateRandomNumberId(),
            }
          : prev
      );

      return updatedBookings;
    });
  };

  const deleteBooking: BookingsContextType["deleteBooking"] = (booking) => {
    const modifiedHosts = hosts.map((host) => {
      if (host.hostId === booking.hostId) {
        const filteredDates = host.blockedDates.filter(
          (pair) => pair[0] !== booking.startDate || pair[1] !== booking.endDate
        );
        return { ...host, blockedDates: filteredDates };
      }
      return host;
    });
    setHosts(modifiedHosts);

    return setBookings((prevBookings) => {
      return prevBookings.filter((prev) => prev.id !== booking.id);
    });
  };

  const updateHost: BookingsContextType["updateHost"] = (newItem) => {
    setHosts((prevHosts) => {
      const updatedHost: GetHosts[] = prevHosts.map((prev) =>
        JSON.stringify(prev) === JSON.stringify(newItem) ? prev : newItem
      );

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
