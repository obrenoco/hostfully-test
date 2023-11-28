import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Modal, Form, Empty, notification, Input, Skeleton } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import moment from "moment";
import { BookingContext } from "../context/BookingsContext";
import {
  calculateTotalNights,
  dateRangeToObject,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "../utils/dates";
import { BookingCard } from "./components/BookingCard";
import { BookingModal } from "./components/BookingModal";
import { BookingType, DateRange } from "../types/booking";

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

const dataSource: BookingType[] = [
  {
    key: 1,
    name: "Cabo Frio - 3 bedroom",
    startDate: "12/01/2023",
    endDate: "12/02/2023",
    totalNights: 1,
    dailyPrice: 150,
    totalPrice: 150,
    adults: 2,
    kids: 3,
    enfants: 1,
    img: "https://viagemeturismo.abril.com.br/wp-content/uploads/2023/05/VT-Airbnb-Cabo-Frio-1.jpeg?quality=90&strip=info&w=720&crop=1",
  },
  {
    key: 2,
    name: "Cape Town with amazing view",
    startDate: "12/12/2023",
    endDate: "12/15/2023",
    totalNights: 3,
    totalPrice: 450,
    dailyPrice: 150,
    adults: 4,
    kids: 0,
    enfants: 1,
    img: "https://a.cdn-hotels.com/gdcs/production67/d440/98ce2718-e399-48d7-867e-5a49a19d87f3.jpg",
    observations:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  },
];

export const Bookings = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [totalNights, setTotalNights] = useState(0);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);
  const { bookings, addBooking, updateBooking, deleteBooking, setBookings } =
    useContext(BookingContext);
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    setBookings(dataSource);
  }, [setBookings]);

  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleCancel = () => {
    form.resetFields();
    setTotalNights(0);
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

  const handleCreateBooking = async (item: BookingType & DateRange) => {
    const convertedDates = dateRangeToObject(item.dateRange);
    const { dateRange, ...modified } = {
      ...item,
      key: Math.floor(Math.random() * 10 ** 10),
      startDate: convertedDates?.startDate,
      endDate: convertedDates?.endDate,
      totalPrice: item.dailyPrice * item.totalNights,
    };

    console.log(modified);

    try {
      await form.validateFields();
      addBooking(modified);
      openNotificationWithIcon(NotificationType.Success);
      handleCancel();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const onChangeDateRange = (val: DateRange["dateRange"]) => {
    if (isOverlapingWithBlockedDates(val, bookings)) {
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
      console.log(calculateTotalNights(val));

      setTotalNights(calculateTotalNights(val));
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

  const onClickView = (booking: BookingType) => {
    form.setFieldsValue({
      ...booking,
      dateRange: [
        moment(booking.startDate, dateFormatList[0]),
        moment(booking.endDate, dateFormatList[0]),
      ],
    });
    setTotalNights(booking.totalNights);
    setActionMode(ActionMode.View);
    setIsModalOpen(true);
  };

  const onClickEdit = (booking: BookingType) => {
    form.setFieldsValue({
      ...booking,
      dateRange: [
        moment(booking.startDate, dateFormatList[0]),
        moment(booking.endDate, dateFormatList[0]),
      ],
    });
    setTotalNights(booking.totalNights);
    // setTotalNights(calculateTotalNights(booking));
    setActionMode(ActionMode.Edit);
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
      onCancel() {},
    });
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
                booking={booking}
                index={index}
                onClickDelete={onClickDelete}
                onClickView={onClickView}
                onClickEdit={onClickEdit}
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
        onFinish={handleCreateBooking}
        setActionMode={setActionMode}
        isSubmitButtonDisabled={isSubmitBtnDisabled}
        totalNights={totalNights}
      />
    </div>
  );
};
