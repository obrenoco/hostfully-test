import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Modal, Form, Empty, notification, Input } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import moment from "moment";
import { BookingContext } from "./context/BookingsContext";
import {
  calculateTotalNights,
  dateFormat,
  dateRangeToObject,
} from "../../utils/dates";
import { BookingCard } from "./components/BookingCard";
import { BookingModal } from "./components/BookingModal";
import { BookingType, DateRange } from "./types/booking";
import { getAvailableProperties, getBookings } from "./apiGetBookings";

enum NotificationType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

export const Bookings = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [availableBookings, setAvailableBookings] = useState<BookingType[]>([]);
  const { bookings, addBooking, updateBooking, deleteBooking, setBookings } =
    useContext(BookingContext);
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    setAvailableBookings(getAvailableProperties);
  }, []);

  useEffect(() => {
    setBookings(getBookings);
  }, [setBookings]);

  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setActionMode(ActionMode.Create);
    setIsModalOpen(true);
  };

  const openNotificationWithIcon = (type: NotificationType) => {
    notification[type]({
      message: type === "success" && "Booking created",
    });
  };

  const searchBooking = (e: ChangeEvent<HTMLInputElement>) => {
    const searchStr = e.target.value;
    const filteredItems = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchStr.toLowerCase()) ||
        booking.startDate.includes(searchStr) ||
        booking.endDate.includes(searchStr)
    );
    return setFilteredBookings(filteredItems || bookings);
  };

  const onClickViewUpdateButton = (
    currentBooking: BookingType,
    action: ActionMode
  ) => {
    const editedField = {
      ...currentBooking,
      property: currentBooking.key,
      img: currentBooking.img,
      dateRange: [
        moment(currentBooking.startDate, dateFormat),
        moment(currentBooking.endDate, dateFormat),
      ],
    };
    form.setFieldsValue(editedField);
    setActionMode(action);
    setIsModalOpen(true);
  };

  const onClickDelete = (booking: BookingType) => {
    Modal.confirm({
      title: "Are you sure delete this booking?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        try {
          deleteBooking(booking.key);
          notification.success({
            message: "Booking successfully deleted",
          });
        } catch (error) {
          notification.error({
            message: "Couldn't delete booking. Try again later.",
          });
        }
      },
      onCancel() {
        setIsModalOpen(false);
      },
    });
  };

  const handleCreateBooking = async (item: BookingType & DateRange) => {
    const convertedDates = dateRangeToObject(item.dateRange);

    const { dateRange, ...modified } = {
      ...item,
      key: Math.floor(Math.random() * 10 ** 10),
      startDate: convertedDates?.startDate,
      endDate: convertedDates?.endDate,
      totalPrice: item.dailyPrice * item.totalNights,
    };

    console.log(form.getFieldsValue());

    try {
      await form.validateFields();
      addBooking(modified);
      openNotificationWithIcon(NotificationType.Success);
      handleCancel();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const handleUpdateBooking = () => {
    try {
      const item: BookingType & DateRange = form.getFieldsValue();
      console.log(
        availableBookings.find(
          (availableBooking) => availableBooking.key === item.key
        )
      );

      const convertedDates = dateRangeToObject(item.dateRange);
      const { dateRange, ...modified } = {
        ...item,
        key: Math.floor(Math.random() * 10 ** 10),
        startDate: convertedDates?.startDate,
        endDate: convertedDates?.endDate,
        totalPrice: item.dailyPrice * calculateTotalNights(item.dateRange),
        totalNights: calculateTotalNights(item.dateRange),
      };

      updateBooking(form.getFieldsValue());
      notification.success({ message: "Booking successfully updated" });
      setIsModalOpen(false);
      handleCancel();
    } catch (error) {}
  };

  return (
    <div>
      <section className="py-4 px-6">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={openCreateModal}
            className="bg-primary text-white px-3 rounded-sm"
          >
            <PlusOutlined /> New booking
          </button>

          <Input
            style={{ width: 200 }}
            addonBefore={<SearchOutlined />}
            placeholder="Search"
            allowClear
            onChange={searchBooking}
          />
        </div>

        <div className="flex flex-col gap-10 my-12">
          {}

          {filteredBookings.length === 0 ? (
            <Empty description="No booking found" />
          ) : (
            filteredBookings.map((booking, index) => (
              <BookingCard
                index={index}
                booking={booking}
                onClickDelete={onClickDelete}
                onClickView={(booking) =>
                  onClickViewUpdateButton(booking, ActionMode.View)
                }
                onClickEdit={(booking) =>
                  onClickViewUpdateButton(booking, ActionMode.Edit)
                }
                key={booking.key}
              />
            ))
          )}
        </div>
      </section>

      <BookingModal
        form={form}
        isModalOpen={isModalOpen}
        actionMode={actionMode}
        setActionMode={setActionMode}
        bookings={bookings}
        availableBookings={availableBookings}
        handleCreateBooking={handleCreateBooking}
        handleCancel={handleCancel}
        handleUpdateBooking={handleUpdateBooking}
      />
    </div>
  );
};
