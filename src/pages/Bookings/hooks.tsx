import { useEffect, useContext } from "react";
import { BookingContext } from "./context";
import { getHosts, getBookings } from "./mock";

export const useBookingData = () => {
  const { bookings, setBookings, setHosts } = useContext(BookingContext);

  useEffect(() => {
    setBookings(bookings);
  }, [bookings, setBookings]);

  useEffect(() => {
    setBookings(getBookings);
    setHosts(getHosts);
  }, [setBookings, setHosts]);
};
