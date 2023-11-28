import { calculateDaysDifference } from "../utils/dates";
import PlaceholderImage from "../assets/placeholder.png";
import { formatCurrency } from "../utils/currencies";
import { PostBookingType } from "../types/booking";

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

type BookingCardType = {
  index: number;
  booking: PostBookingType;
  onClickView: (booking: PostBookingType) => void;
  onClickEdit: (booking: PostBookingType) => void;
  onClickDelete: (booking: PostBookingType) => void;
};

const StatusDot = ({ color, text }: { color: string; text: string }) => (
  <div className="relative inline-block">
    <div
      className={`w-16 h-16 rounded-full overflow-hidden border-4 border-${color} flex items-center justify-center md:w-20 md:h-20`}
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
  onClickDelete,
  onClickEdit,
  onClickView,
}: BookingCardType) => (
  <div className="flex flex-col items-center w-full gap-5" key={index}>
    <div className="flex items-center w-full">
      <div className="relative mr-5 hidden md:inline-block">
        <div className="w-20 h-20 rounded-full overflow-hidden p-1 border-4 border-secondary ">
          <img
            src={booking.img || PlaceholderImage}
            alt="Round photography"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <div className="w-full flex flex-col md:gap-2 min-w-[350px]">
        <div className="flex justify-between items-center md:pb-3 md:border-b-2 md:border-light-grey">
          <span>{booking.name}</span>

          <div className="flex items-center flex-col-reverse">
            <span className="w-20">{booking.startDate}</span>
            <span className="text-center rounded-sm bg-secondary text-white w-20">
              {formatCurrency(booking.price, booking.currency)}
            </span>
          </div>
        </div>

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
            <span className="w-20">{booking.endDate}</span>
            <span className="w-20 text-center rounded-sm border-2 border-secondary">
              {calculateDaysDifference([booking.startDate, booking.endDate])}{" "}
              {calculateDaysDifference([booking.startDate, booking.endDate]) ===
              1
                ? "day"
                : "days"}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center w-full justify-between flex-col gap-4">
      <div className="flex items-center  w-full justify-between">
        <StatusDot color="primary" text="Pending" />
        <StatusDivider />
        <StatusDot color="light-grey" text="Booked" />
        <StatusDivider />
        <StatusDot color="light-grey" text="Stay" />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <button
          className="bg-secondary text-white rounded-sm border-none w-full py-0.5 md:w-20"
          onClick={() => onClickView(booking)}
        >
          View
        </button>
        <button
          className="bg-tertiary-yellow text-white rounded-sm w-full py-0.5 md:w-20"
          onClick={() => onClickEdit(booking)}
        >
          Edit
        </button>
        <button
          className="bg-tertiary-orange text-white rounded-sm w-full py-0.5 md:w-20"
          onClick={() => onClickDelete(booking)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
