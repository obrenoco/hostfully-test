import { Button } from "antd";
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
  <div
    style={{
      display: "flex",
      gap: 5,
      fontSize: 10,
      alignItems: "center",
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "grey",
        padding: "0px 4px",
        borderRadius: "50%",
        height: 20,
        width: 20,
        color: "white",
      }}
    >
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

export const BookingCard = ({
  index,
  booking,
  onClickDelete,
  onClickEdit,
  onClickView,
}: BookingCardType) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginRight: 20,
          }}
        >
          <div
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #81b585",
              padding: 4,
            }}
          >
            <img
              src={booking.img || PlaceholderImage}
              alt="Round photography"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            minWidth: 350,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px #dcdcdc solid",
              paddingBottom: 10,
            }}
          >
            <span>{booking.name}</span>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: 90 }}>{booking.startDate}</span>
              <span
                style={{
                  width: 100,
                  textAlign: "center",
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                {formatCurrency(booking.price, booking.currency)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 5 }}>
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

            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: 90 }}>{booking.endDate}</span>
              <span
                style={{
                  width: 100,
                  textAlign: "center",
                  border: "3px solid green",
                  borderRadius: 3,
                }}
              >
                {calculateDaysDifference([booking.startDate, booking.endDate])}{" "}
                {calculateDaysDifference([
                  booking.startDate,
                  booking.endDate,
                ]) === 1
                  ? "day"
                  : "days"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0 20px",
            width: "100%",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 10px",
            }}
          >
            <div
              style={{
                width: "85px",
                height: "85px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid  #6e8fc5",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, color: "#6e8fc5" }}>Pending</span>
            </div>
          </div>

          <div
            style={{
              height: 3,
              width: "100%",
              backgroundColor: "#e4e4e4",
            }}
          ></div>

          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 10px",
            }}
          >
            <div
              style={{
                width: "85px",
                height: "85px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid #e4e4e4",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, color: "#e4e4e4" }}>Booked</span>
            </div>
          </div>

          <div
            style={{
              height: 3,
              width: "100%",
              backgroundColor: "#e4e4e4",
            }}
          ></div>

          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 10px",
            }}
          >
            <div
              style={{
                width: "85px",
                height: "85px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "6px solid #e4e4e4",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 16, color: "#e4e4e4" }}>Stay</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Button
            type="primary"
            size="small"
            style={{
              backgroundColor: "rgb(110, 143, 197)",
              color: "white",
              borderRadius: 5,
              border: "none",
              width: 75,
            }}
            onClick={() => onClickView(booking)}
          >
            View
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: "orange",
              color: "white",
              borderRadius: 5,
              width: 75,
            }}
            onClick={() => onClickEdit(booking)}
          >
            Edit
          </Button>
          <Button
            size="small"
            style={{
              backgroundColor: "#bf8080",
              color: "white",
              borderRadius: 5,
              width: 75,
            }}
            onClick={() => onClickDelete(booking)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
