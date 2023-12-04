import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { ChangeEvent, Dispatch } from "react";
import { GetBookings } from "../types";

type BookingsHeaderType = {
  openCreateModal: () => void;
  contextBookings: GetBookings[];
  setFilteredBookings: Dispatch<React.SetStateAction<GetBookings[]>>;
};

export const BookingsHeader = ({
  openCreateModal,
  contextBookings,
  setFilteredBookings,
}: BookingsHeaderType) => {
  const onChangeSearchBooking = (e: ChangeEvent<HTMLInputElement>) => {
    const searchStr = e.target.value;
    const filteredItems = contextBookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchStr.toLowerCase()) ||
        booking.startDate.includes(searchStr) ||
        booking.endDate.includes(searchStr)
    );
    return setFilteredBookings(filteredItems || contextBookings);
  };

  return (
    <header className="flex justify-between">
      <button
        onClick={openCreateModal}
        className="bg-primary text-white px-3 rounded-sm"
      >
        <PlusOutlined /> New booking
      </button>

      <div className="w-52">
        <Input
          addonBefore={<SearchOutlined />}
          placeholder="Search"
          allowClear
          onChange={onChangeSearchBooking}
        />
      </div>
    </header>
  );
};
