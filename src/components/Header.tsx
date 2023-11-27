import { Avatar } from "antd";
export const Header = () => (
  <header
    style={{
      width: "100%",
      borderBottom: "2px solid #E2E2E2",
      height: 70,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "white",
      padding: "0 50px",
    }}
  >
    <img
      width="auto"
      height="30"
      src="https://www.hostfully.com/wp-content/uploads/2022/08/logo-1.svg"
      alt=""
    ></img>
    <div
      style={{
        display: "flex",
        gap: 100,
        height: "100%",
        alignItems: "center",
      }}
    >
      <button
        style={{
          color: "gray",
          border: "0",
          borderTop: "2px orange solid",
          backgroundColor: "transparent",
          height: "100%",
          fontWeight: 700,
        }}
      >
        Bookings
      </button>
      <Avatar
        size={"large"}
        src="https://www.hostfully.com/wp-content/uploads/2022/11/hostfully.png"
      />
    </div>
  </header>
);
