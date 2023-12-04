import { useContext, useEffect, useState } from "react";
import { Form, Empty, notification } from "antd";
import "antd/dist/antd.min.css";
import moment from "moment";
import { BookingContext } from "./context";
import { calendarDateFormat, dateRangeToObject } from "../../utils/dates";
import { CreateUpdateBookingModal } from "./components/Modal";
import {
  ActionMode,
  BookingsFormFields,
  BookingsFormTypes,
  DateRange,
  GetBookings,
  GetHosts,
  NotificationType,
} from "./types";
import { BookingCard } from "./components/Card";
import { generateRandomNumberId } from "../../utils/numbers";
import { useBookingData } from "./hooks";
import { BookingsHeader } from "./components/Header";

const openNotificationWithIcon = (type: NotificationType) => {
  notification[type]({
    message: type === "success" && "Booking created",
  });
};

export const Bookings = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);

  const {
    bookings: contextBookings,
    addBooking,
    hosts,
    setHosts,
    updateBooking,
    deleteBooking,
  } = useContext(BookingContext);

  const [filteredBookings, setFilteredBookings] = useState(contextBookings);

  useBookingData();

  useEffect(() => {
    setFilteredBookings(contextBookings);
  }, [contextBookings]);

  const handleCancel = () => {
    form.resetFields();
    form.setFieldValue(BookingsFormFields.Image, "");
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setActionMode(ActionMode.Create);
    setIsModalOpen(true);
  };

  const onClickViewUpdateButton = (
    currentBooking: GetBookings,
    action: ActionMode
  ) => {
    const currentHost = hosts.find(
      (host) => currentBooking.hostId === host.hostId
    )!;
    const editedFormFields = {
      ...currentBooking,
      property: currentBooking.id,
      img: currentBooking.img,
      blockedDates: currentHost.blockedDates,
      dateRange: [
        moment(currentBooking.startDate, calendarDateFormat),
        moment(currentBooking.endDate, calendarDateFormat),
      ],
    };
    form.setFieldsValue(editedFormFields);
    setActionMode(action);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = (booking: GetBookings) => {
    try {
      deleteBooking(booking);
      notification.success({
        message: "Booking successfully deleted",
      });
    } catch (error) {
      notification.error({
        message: "Couldn't delete booking. Try again later.",
      });
    }
  };

  const handleCreateBooking = (item: BookingsFormTypes) => {
    const { startDate, endDate } = dateRangeToObject(item.dateRange);
    const updatedHosts: GetHosts[] = hosts.map((host) =>
      item["id"] === host.hostId
        ? {
            ...host,
            blockedDates: [...host.blockedDates, [startDate, endDate]],
          }
        : host
    );

    const updatedBooking: GetBookings = {
      id: generateRandomNumberId(),
      hostId: item.id,
      blockedDates: [...item.blockedDates, [startDate, endDate]],
      dailyPrice: item.dailyPrice,
      startDate,
      endDate,
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
      addBooking(updatedBooking);
      setHosts(updatedHosts);
      openNotificationWithIcon(NotificationType.Success);
      handleCancel();
    } catch (error) {
      openNotificationWithIcon(NotificationType.Error);
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
    <main>
      <section className="py-4 px-6 laptop:w-[85%] mx-auto">
        <BookingsHeader
          openCreateModal={openCreateModal}
          contextBookings={contextBookings}
          setFilteredBookings={setFilteredBookings}
        />

        <div className="flex flex-col gap-10 my-12">
          {filteredBookings.length === 0 ? (
            <Empty description="No booking found" />
          ) : (
            <ul className="list-none">
              {filteredBookings.map((booking, index) => (
                <li key={booking.id}>
                  <BookingCard
                    index={index}
                    booking={booking}
                    handleDeleteBooking={handleDeleteBooking}
                    onClickView={(booking) =>
                      onClickViewUpdateButton(booking, ActionMode.View)
                    }
                    onClickEdit={(booking) =>
                      onClickViewUpdateButton(booking, ActionMode.Edit)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CreateUpdateBookingModal
        form={form}
        isModalOpen={isModalOpen}
        actionMode={actionMode}
        setActionMode={setActionMode}
        hosts={hosts}
        handleCreateBooking={handleCreateBooking}
        handleCancel={handleCancel}
        handleUpdateBooking={handleUpdateBooking}
      />
    </main>
  );
};
