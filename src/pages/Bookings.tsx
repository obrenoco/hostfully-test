import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Modal, Form, Empty, notification, Input } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import moment from "moment";
import { BookingContext } from "../context/BookingsContext";
import {
  calculateDaysDifference,
  dateRangeToObject,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "../utils/dates";
import { BookingCard } from "../components/BookingCard";
import { BookingModal } from "../components/BookingModal";
import { PostBookingType } from "../types/booking";

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

const dailyPrice = 150;

const dateFormatList = ["MM/DD/YYYY", "MM/DD/YYYY"];

export const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [daysDifference, setDaysDifference] = useState(0);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);
  const [form] = Form.useForm();
  const { bookings, addBooking, updateBooking, deleteBooking } =
    useContext(BookingContext);
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleCancel = () => {
    form.resetFields();
    setDaysDifference(0);
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

  const onFinish = async (item: PostBookingType) => {
    const convertedDates = dateRangeToObject(item.dateRange!);
    const { dateRange, ...modified } = {
      ...item,
      key: Math.floor(Math.random() * 10 ** 10),
      startDate: convertedDates?.startDate,
      endDate: convertedDates?.endDate,
      price: daysDifference * dailyPrice,
    };

    try {
      await form.validateFields();
      addBooking(modified);
      openNotificationWithIcon(NotificationType.Success);
      handleCancel();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const onChangeDateRange = (
    _: any,
    valueArray: PostBookingType["dateRange"]
  ) => {
    if (isOverlapingWithBlockedDates(valueArray!, bookings)) {
      form.setFields([
        {
          name: "dateRange",
          validating: false,
          validated: false,
          errors: ["Dates are not available"],
        },
      ]);
      setIsSubmitBtnDisabled(true);
    } else {
      setIsSubmitBtnDisabled(false);
    }
    console.log(form.getFieldError("dateRange"));
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

  const handleUpdateBooking = () => {
    try {
      updateBooking(form.getFieldsValue());
      notification.success({ message: "Booking successfully updated" });
      setIsModalOpen(false);
      handleCancel();
    } catch (error) {}
  };

  const onClickView = (booking: PostBookingType) => {
    form.setFieldsValue({
      ...booking,
      dateRange: [
        moment(booking.startDate, dateFormatList[0]),
        moment(booking.endDate, dateFormatList[0]),
      ],
    });
    setActionMode(ActionMode.View);
    setIsModalOpen(true);
  };

  const onClickEditing = (booking: PostBookingType) => {
    form.setFieldsValue({
      ...booking,
      dateRange: [
        moment(booking.startDate, dateFormatList[0]),
        moment(booking.endDate, dateFormatList[0]),
      ],
    });
    setDaysDifference(
      calculateDaysDifference([booking.startDate, booking.endDate])
    );
    setActionMode(ActionMode.Edit);
    setIsModalOpen(true);
  };

  const onClickDelete = (booking: PostBookingType) => {
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
      onCancel() {},
    });
  };

  return (
    <div>
      <section className="p-4">
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 75,
            margin: "50px 0",
          }}
        >
          {}

          {filteredBookings.length === 0 ? (
            <Empty description="No booking found" />
          ) : (
            filteredBookings.map((booking, index) => (
              <BookingCard
                booking={booking}
                index={index}
                onClickDelete={onClickDelete}
                onClickView={onClickView}
                onClickEdit={onClickEditing}
                key={booking.key}
              />
            ))
          )}
        </div>
      </section>

      <BookingModal
        actionMode={actionMode}
        disabledDate={generateBlockedDates(bookings)}
        form={form}
        handleCancel={handleCancel}
        handleUpdateBooking={handleUpdateBooking}
        isModalOpen={isModalOpen}
        onChangeDateRange={onChangeDateRange}
        onFinish={onFinish}
        setActionMode={setActionMode}
        isSubmitButtonDisabled={isSubmitBtnDisabled}
      />
    </div>
  );
};
