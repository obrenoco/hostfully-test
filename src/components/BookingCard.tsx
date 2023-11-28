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
    <span className="flex items-center justify-center px-1 rounded-full text-white bg-gray-400 h-5 w-5">
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
  <div className={`relative inline-block m-2`}>
    <div
      className={`w-20 h-20 overflow-hidden border-4 border-${color}-500 rounded-full p-2 flex items-center justify-center`}
    >
      <span className={`text-lg text-${color}-500`}>{text}</span>
    </div>
  </div>
);

export const BookingCard = ({
  index,
  booking,
  onClickDelete,
  onClickEdit,
  onClickView,
}: BookingCardType) => (
  <div className="flex items-center w-full" key={index}>
    <div className="flex items-center w-full">
      <div className="relative inline-block mr-5">
        <div className="w-20 h-20 rounded-full overflow-hidden p-1 border-4 border-[#81b585]">
          <img
            src={booking.img || PlaceholderImage}
            alt="Round photography"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 min-w-[350px]">
        <div className="flex justify-between items-center pb-3 border-b-2 border-[#dcdcdc]">
          <span>{booking.name}</span>

          <div className="flex items-center">
            <span className="w-24">{booking.startDate}</span>
            <span className="w-24 text-center rounded-sm bg-green-700 text-white">
              {formatCurrency(booking.price, booking.currency)}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-1">
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

          <div className="flex items-center">
            <span className="w-24">{booking.endDate}</span>
            <span className="w-24 text-center rounded-sm border-2 border-green-700">
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

    <div className="flex items-center w-full">
      <div className="flex items-center mx-5 w-full">
        <div className="relative inline-block mx-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6e8fc5] flex items-center justify-center">
            <span className="text-sm text-[#6e8fc5]">Pending</span>
          </div>
        </div>

        <div className="h-1 w-full bg-gray-200"></div>

        <div className="relative inline-block mx-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden p-2 border-8 border-grey">
            <span className="text-sm text-[#e4e4e4]">Booked</span>
          </div>
        </div>

        <div className="h-1 w-full bg-[#e4e4e4]"></div>

        <div className="relative inline-block mx-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden p-2 border-8 border-grey">
            <span className="text-sm text-[#e4e4e4]">Stay</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <button
          className="bg-blue-500 text-white rounded-md border-none w-20"
          onClick={() => onClickView(booking)}
        >
          View
        </button>
        <button
          className="bg-orange-500 text-white rounded-md w-20"
          onClick={() => onClickEdit(booking)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white rounded-md w-20"
          onClick={() => onClickDelete(booking)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
