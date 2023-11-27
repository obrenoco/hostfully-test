import { ChangeEvent, Fragment, useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Empty,
  notification,
  Input,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import moment from "moment";
import { BookingContext } from "./context/BookingsContext";
import { formatCurrency } from "../../utils/currencies";
import { calculateDaysDifference, dateRangeToObject } from "../../utils/dates";
import { primaryColor } from "../../App";

export type BookingType = {
  key: number;
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  observations?: string;
  dateRange?: moment.Moment[];
  adults: number;
  kids?: number;
  enfants?: number;
  img?: string;
};

type NotificationType = "success" | "info" | "warning" | "error";

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

const formFieldRules = [{ required: true, message: "This field is required." }];

const guestOptions = [
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
];

const dailyPrice = 150;

const dateFormatList = ["MM/DD/YYYY", "MM/DD/YYYY"];

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

export const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [daysDifference, setDaysDifference] = useState(0);
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

  const onFinish = async (item: any) => {
    try {
      await form.validateFields();
      const convertedDates = dateRangeToObject(item.dateRange);
      console.log("price", daysDifference * dailyPrice);

      addBooking({
        ...item,
        key: Math.random(),
        startDate: convertedDates?.startDate,
        endDate: convertedDates?.endDate,
        price: daysDifference * dailyPrice,
      });
      openNotificationWithIcon("success");
      handleCancel();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const onChangeDateRange = (value: any, valueArray: string[]) =>
    setDaysDifference(calculateDaysDifference(valueArray));

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
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

  const modalFooter = () => {
    if (actionMode === ActionMode.View) {
      return (
        <Button
          key="edit"
          form="create"
          onClick={() => setActionMode(ActionMode.Edit)}
        >
          Edit
        </Button>
      );
    }
    if (actionMode === ActionMode.Edit) {
      return (
        <div>
          <Button key="cancel" form="create" onClick={handleCancel}>
            Cancel
          </Button>
          ,
          <Button key="update" type="primary" onClick={handleUpdateBooking}>
            Update
          </Button>
        </div>
      );
    }
    if (actionMode === ActionMode.Create) {
      return (
        <div>
          <Button key="cancel" form="create" onClick={handleCancel}>
            Cancel
          </Button>
          ,
          <Button key="submit" type="primary" htmlType="submit" form="create">
            Create
          </Button>
        </div>
      );
    }
    return;
  };

  const onClickView = (booking: BookingType) => {
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

  const onClickEditing = (booking: BookingType) => {
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
      <section style={{ padding: "30px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={openCreateModal}
            type="primary"
            style={{ backgroundColor: primaryColor, borderRadius: 5 }}
          >
            <PlusOutlined /> New booking
          </Button>

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
                        src="https://images.unsplash.com/photo-1530785602389-07594beb8b73?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                        {booking.kids && (
                          <GuestIcon num={booking.kids} type={"Children"} />
                        )}
                        {booking.enfants && (
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
                          {calculateDaysDifference([
                            booking.startDate,
                            booking.endDate,
                          ])}{" "}
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
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0 20px",
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
                          border: "6px solid #6e8fc5",
                          padding: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 16, color: "#6e8fc5" }}>
                          Queue
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        height: 3,
                        width: 30,
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
                          border: "6px solid  #e4e4e4",
                          padding: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 16, color: "#e4e4e4" }}>
                          Pending
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        height: 3,
                        width: 30,
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
                        <span style={{ fontSize: 16, color: "#e4e4e4" }}>
                          Booked
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        height: 3,
                        width: 30,
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
                        <span style={{ fontSize: 16, color: "#e4e4e4" }}>
                          Stay
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
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
                      onClick={() => onClickEditing(booking)}
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
            ))
          )}
        </div>
      </section>

      <Modal
        title={
          actionMode === ActionMode.Create ? "New booking" : "Update booking"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 20 }}
        footer={modalFooter()}
      >
        <Form
          disabled={actionMode === ActionMode.View}
          name="create"
          id="create"
          onFinish={onFinish}
          form={form}
          layout="vertical"
        >
          <Form.Item name={"key"} hidden>
            <Fragment />
          </Form.Item>
          <Form.Item name={"img"} label="Image">
            <Input placeholder="URL" />
          </Form.Item>
          <Form.Item name={"name"} rules={formFieldRules} label="Name">
            <Input placeholder="Title" />
          </Form.Item>

          <p>Guests</p>
          <div style={{ display: "flex", width: "100%", gap: 10 }}>
            <Form.Item
              name={"adults"}
              rules={formFieldRules}
              style={{ width: "100%" }}
              label="Adults"
            >
              <Select options={guestOptions.slice(1)} />
            </Form.Item>
            <Form.Item name={"kids"} style={{ width: "100%" }} label="Children">
              <Select options={guestOptions} />
            </Form.Item>
            <Form.Item
              name={"enfants"}
              style={{ width: "100%" }}
              label="Enfants"
            >
              <Select options={guestOptions} />
            </Form.Item>
          </div>

          <Form.Item
            name={"dateRange"}
            rules={formFieldRules}
            label="Arrival / Depart"
          >
            <DatePicker.RangePicker
              disabledDate={disabledDate}
              aria-required
              onChange={onChangeDateRange}
              format={dateFormatList}
              key={1}
            />
          </Form.Item>
          <p>Total: {daysDifference} days</p>

          <Form.Item name={"observations"} label="Observations">
            <Input.TextArea
              rows={4}
              maxLength={200}
              showCount
              placeholder="Notes (max. 200 characters)"
            ></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
