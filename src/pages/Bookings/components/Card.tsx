import PlaceholderImage from "../../../assets/placeholder.png";
import { formatNumberToDollar } from "../../../utils/currencies";
import { GetBookings } from "../types";
import { useState } from "react";
import { DeleteBookingModal } from "./Modal";

type BookingCardType = {
  index: number;
  booking: GetBookings;
  onClickView: (currentooking: GetBookings) => void;
  onClickEdit: (currentooking: GetBookings) => void;
  handleDeleteBooking: (currentooking: GetBookings) => void;
};

const GuestIcon = ({
  num,
  type,
}: {
  num: number;
  type: "Adults" | "Children" | "Enfants";
}) => (
  <div className="flex gap-1 text-xs items-center">
    <span className="flex items-center justify-center px-1 rounded-full text-white bg-tertiary-text h-5 w-5">
      {num}
    </span>
    <span>{type}</span>
  </div>
);

const StatusDot = ({ color, text }: { color: string; text: string }) => (
  <div className="relative inline-block">
    <div
      className={`w-20 h-20 rounded-full overflow-hidden border-4 border-${color} flex items-center justify-center md:w-20 md:h-20`}
    >
      <span className={`text-sm text-${color}`}>{text}</span>
    </div>
  </div>
);

const StatusDivider = () => (
  <div className="h-0.5 w-full min-w-[15px] bg-light-grey"></div>
);

export const BookingCard = ({
  index,
  booking,
  handleDeleteBooking,
  onClickEdit,
  onClickView,
}: BookingCardType) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center w-full gap-4 pb-10 border-b-2 border-light-grey last:border-b-0 laptop:flex-row"
      key={index}
    >
      <section className="flex items-center w-full flex-col gap-4 laptop:flex-row">
        <figure className="relative mr-5 laptop:inline-block">
          <div className="w-24 h-24 rounded-full overflow-hidden p-1 border-4 border-secondary">
            <img
              src={booking.img || PlaceholderImage}
              alt="Round photography"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </figure>

        <div className="w-full flex flex-col laptop:gap-2">
          <header className="flex justify-between items-center laptop:pb-3 laptop:border-b-2 laptop:border-light-grey">
            <span>{booking.name}</span>

            <div className="flex flex-col-reverse items-end border-b-2 border-light-grey laptop:border-none laptop:items-center">
              <span className="w-auto md:w-20">{booking.startDate}</span>
              <span className="text-center rounded-sm bg-primary text-white w-20">
                {formatNumberToDollar(booking.totalPrice)}
              </span>
            </div>
          </header>

          <div className="flex justify-between">
            <div className="flex gap-2 md:flex-col">
              {booking.adults && (
                <GuestIcon num={booking.adults} type={"Adults"} />
              )}
              {booking.kids > 0 && (
                <GuestIcon num={booking.kids} type={"Children"} />
              )}
              {booking.enfants > 0 && (
                <GuestIcon num={booking.enfants} type={"Enfants"} />
              )}
            </div>

            <div className="flex items-center flex-col">
              <span className="w-auto md:w-20">{booking.endDate}</span>
              <span className="w-20 text-center rounded-sm border-2 border-primary text-primary">
                {booking.totalNights}{" "}
                {booking.totalNights === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex items-center w-full justify-between flex-col gap-10 laptop:flex-row">
        <div className="flex items-center w-full justify-between">
          <StatusDot color="primary" text="Pending" />
          <StatusDivider />
          <StatusDot color="light-grey" text="Booked" />
          <StatusDivider />
          <StatusDot color="light-grey" text="Stay" />
        </div>

        <nav className="flex flex-col gap-1 w-full laptop:w-20">
          <button
            className="bg-secondary text-white rounded-sm border-none w-full py-1"
            onClick={() => {
              onClickView(booking);
            }}
          >
            View
          </button>
          <button
            className="bg-tertiary-yellow text-white rounded-sm w-full py-1"
            onClick={() => onClickEdit(booking)}
          >
            Edit
          </button>
          <button
            className="bg-tertiary-orange text-white rounded-sm w-full py-1"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </button>
        </nav>
      </aside>
      <DeleteBookingModal
        booking={booking}
        handleDeleteBooking={handleDeleteBooking}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};
