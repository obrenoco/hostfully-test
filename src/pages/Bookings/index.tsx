import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Modal, Form, Empty, notification, Input } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import moment from "moment";
import { BookingContext } from "./context";
import { dateFormat, dateRangeToObject } from "../../utils/dates";
import {
  BookingModal,
  BookingsFormField,
  BookingsFormTypes,
} from "./components/Modal";
import { DateRange, GetBookings, GetHosts } from "./types";
import { getHosts, getBookings } from "./api";
import { BookingCard } from "./components/Card";
import { randomNumberId } from "../../utils/number";

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

  const {
    bookings: contextBookings,
    addBooking,
    setBookings,
    hosts,
    setHosts,
    updateBooking,
    deleteBooking,
  } = useContext(BookingContext);

  const [filteredBookings, setFilteredBookings] = useState(contextBookings);

  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings, setBookings]);

  useEffect(() => {
    setBookings(getBookings);
    setHosts(getHosts);
  }, [setBookings, setHosts]);

  useEffect(() => {
    setFilteredBookings(contextBookings);
  }, [contextBookings]);

  const handleCancel = () => {
    form.resetFields();
    form.setFieldValue(BookingsFormField.Image, "");
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
    const filteredItems = contextBookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchStr.toLowerCase()) ||
        booking.startDate.includes(searchStr) ||
        booking.endDate.includes(searchStr)
    );
    return setFilteredBookings(filteredItems || contextBookings);
  };

  const onClickViewUpdateButton = (
    currentBooking: GetBookings,
    action: ActionMode
  ) => {
    const editedField = {
      ...currentBooking,
      property: currentBooking.id,
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

  const onClickDelete = (booking: GetBookings) => {
    Modal.confirm({
      title: "Are you sure delete this booking?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        try {
          deleteBooking(booking.id);
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

  const handleCreateBooking = (item: BookingsFormTypes) => {
    const { startDate, endDate } = dateRangeToObject(item.dateRange);
    const newHost: GetHosts[] = hosts.map((host) =>
      item["id"] === host.hostId
        ? {
            ...host,
            blockedDates: [...host.blockedDates, [startDate, endDate]],
          }
        : host
    );

    const newBooking: GetBookings = {
      id: randomNumberId(),
      hostId: item.id,
      blockedDates: [...item.blockedDates, [startDate, endDate]],
      dailyPrice: item.dailyPrice,
      startDate: startDate,
      endDate: endDate,
      adults: item.adults,
      kids: item.kids,
      enfants: item.enfants,
      img: item.img,
      name: hosts.find((host) => host.hostId === item.id)!.name,
      totalNights: item.totalNights,
      totalPrice: item.totalPrice,
      observations: item.observations,
    };

    try {
      addBooking(newBooking);
      setHosts(newHost);
      openNotificationWithIcon(NotificationType.Success);
      handleCancel();
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  const handleUpdateBooking = () => {
    try {
      const item: GetBookings & DateRange = form.getFieldsValue();
      const { startDate, endDate } = dateRangeToObject(item.dateRange);
      updateBooking({ ...item, startDate, endDate });
      notification.success({ message: "Booking successfully updated" });
      setIsModalOpen(false);
      handleCancel();
    } catch (error) {}
  };

  return (
    <div>
      <section className="py-4 px-6 laptop:w-[85%] mx-auto">
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
                key={booking.id}
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
        bookings={contextBookings}
        hosts={hosts}
        handleCreateBooking={handleCreateBooking}
        handleCancel={handleCancel}
        handleUpdateBooking={handleUpdateBooking}
      />
    </div>
  );
};
