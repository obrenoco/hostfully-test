import { Avatar } from "antd";

export const Header = () => (
  <header className="w-full border-b-2 border-gray-300 h-16 flex items-center justify-between text-white px-4 md:px-8">
    <img
      className="h-8"
      src="https://www.hostfully.com/wp-content/uploads/2022/08/logo-1.svg"
      alt=""
    />
    <div className="flex gap-8 h-full items-center">
      <button className="text-gray-500 border-0 border-t-2 border-orange-500 bg-transparent h-full font-bold">
        Bookings
      </button>
      <Avatar
        size={"large"}
        src="https://www.hostfully.com/wp-content/uploads/2022/11/hostfully.png"
      />
    </div>
  </header>
);
