import { useEffect, useContext } from "react";
import { BookingContext } from "./context";
import { getHosts, getBookings } from "./mock";

export const useBookingData = () => {
  const {
    bookings: contextBookings,
    setBookings,
    setHosts,
  } = useContext(BookingContext);

  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings, setBookings]);

  useEffect(() => {
    setBookings(getBookings);
    setHosts(getHosts);
  }, [setBookings, setHosts]);
};
