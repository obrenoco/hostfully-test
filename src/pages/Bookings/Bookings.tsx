import { Fragment, useContext, useState } from "react";
import {
  Table,
  Button,
  Modal,
  DatePicker,
  Form,
  InputNumber,
  notification,
  Typography,
  Input,
  Select,
  Divider,
  Avatar,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusOutlined,
  MenuOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "antd/dist/antd.min.css";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import moment from "moment";
import { BookingContext } from "./context/BookingsContext";
import { convertNumberToDollar } from "../../utils/currencyConverter";
import { calculateDaysDifference, dateRangeToObject } from "../../utils/dates";

export type DataType = {
  key: number;
  name: string;
  startDate: string;
  endDate: string;
  price?: number;
  observations?: string;
  dateRange?: any;
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
const primaryColor = "#2D2AA5";

export const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [daysDifference, setDaysDifference] = useState(0);
  const [form] = Form.useForm();
  const { bookings, addBooking, updateBooking, deleteBooking } =
    useContext(BookingContext);

  const ActionButtons = ({ prop }: { prop: DataType }) => {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        <Button
          shape="circle"
          type="primary"
          style={{ backgroundColor: primaryColor }}
          onClick={() => {
            form.setFieldsValue({
              ...prop,
              dateRange: [
                moment(prop.startDate, dateFormatList[0]),
                moment(prop.endDate, dateFormatList[0]),
              ],
            });
            setActionMode(ActionMode.View);
            setIsModalOpen(true);
          }}
        >
          <EyeFilled />
        </Button>
        <Button
          icon={<EditFilled />}
          shape="circle"
          type="primary"
          style={{ backgroundColor: "#41CAA1" }}
          onClick={() => {
            form.setFieldsValue({
              ...prop,
              dateRange: [
                moment(prop.startDate, dateFormatList[0]),
                moment(prop.endDate, dateFormatList[0]),
              ],
            });
            setDaysDifference(
              calculateDaysDifference([prop.startDate, prop.endDate])
            );
            setActionMode(ActionMode.Edit);
            setIsModalOpen(true);
          }}
        />
        <Button
          icon={<DeleteFilled />}
          shape="circle"
          type="primary"
          danger
          onClick={() => {
            Modal.confirm({
              title: "Are you sure delete this booking?",
              icon: <ExclamationCircleOutlined />,
              content: "Some descriptions",
              okText: "Yes",
              okType: "danger",
              cancelText: "No",
              onOk() {
                try {
                  deleteBooking(prop.key);
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
          }}
        />
      </div>
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (_, value) => (
        <Avatar size={"large"} icon={<UserOutlined />} src={value.img || ""} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.endDate);

        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.endDate);

        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: "Guests",
      dataIndex: "guests",
      key: "guests",
      render: (_, value) => (
        <span>{value.adults + (value.kids || 0) + (value.enfants || 0)}</span>
      ),
    },
    {
      title: "Observations",
      dataIndex: "observations",
      key: "observations",
      render: (text) => {
        return (
          <span style={{ maxWidth: "200px", display: "inline-block" }}>
            {text && (text.length > 50 ? `${text.slice(0, 50)}...` : text)}
          </span>
        );
      },
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
      render: (_, value) => <span>{convertNumberToDollar(value.price!)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, prop) => <ActionButtons prop={prop} />,
    },
  ];

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

  const onChangeDateRange = (value: any, valueArray: string[]) => {
    console.log(value);

    setDaysDifference(calculateDaysDifference(valueArray));
  };

  const expandedRowRender = () => {
    return <h1>Hello</h1>;
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
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

  const rules = [{ required: true, message: "This field is required." }];

  return (
    <div>
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
        <MenuOutlined style={{ fontSize: 20, color: primaryColor }} />
      </header>

      <section style={{ padding: "30px 60px" }}>
        <Typography.Title>My Bookings</Typography.Title>
        {/* <Table
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
          title={() => (
            <Button
              onClick={openCreateModal}
              type="primary"
              style={{ backgroundColor: primaryColor }}
            >
              <PlusOutlined /> Create
            </Button>
          )}
          dataSource={bookings}
          scroll={{ x: 1000 }}
          columns={columns}
        /> */}

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 50,
            margin: "50px 0",
          }}
        >
          {bookings.map((booking, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: "0 20px",
                }}
              >
                <div
                  style={{
                    width: "85px",
                    height: "85px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "6px solid #3498db",
                    padding: 8,
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
                    borderBottom: "2px #dcdcdc solid",
                    paddingBottom: 10,
                  }}
                >
                  <span>Robertinho</span>

                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ width: 100 }}>22/12/2013</span>
                    <span
                      style={{
                        width: 100,
                        textAlign: "center",
                        backgroundColor: "green",
                        color: "white",
                      }}
                    >
                      $200,00
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Adults</span>

                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ width: 100 }}>22/12/2013</span>
                    <span
                      style={{
                        width: 100,
                        textAlign: "center",
                        border: "3px solid green",
                      }}
                    >
                      2 Nights
                    </span>
                  </div>
                </div>
              </div>

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
                      border: "6px solid #e4e4e4",
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, color: "#e4e4e4" }}>
                      Queue
                    </span>
                  </div>
                </div>

                <div
                  style={{ height: 3, width: 30, backgroundColor: "#e4e4e4" }}
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
                      border: "6px solid #6e8fc5",
                      padding: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, color: "#6e8fc5" }}>
                      Pending
                    </span>
                  </div>
                </div>

                <div
                  style={{ height: 3, width: 30, backgroundColor: "#e4e4e4" }}
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
                  style={{ height: 3, width: 30, backgroundColor: "#e4e4e4" }}
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

              <Button
                style={{
                  backgroundColor: "#bf8080",
                  color: "white",
                  borderRadius: 5,
                }}
              >
                {" "}
                Edit
              </Button>
            </div>
          ))}
        </div>
      </section>

      <Modal
        title="New booking"
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
          <Form.Item name={"name"} rules={rules} label="Name">
            <Input placeholder="Title" />
          </Form.Item>

          {/* <Form.Item name={"guests"} rules={rules} label="Guests">
            <Slider
              style={{ width: "100%" }}
              min={1}
              dots
              max={10}
              onChange={onChangeGuests}
              disabled={actionMode === ActionMode.View}
              value={typeof guests === "number" ? guests : 1}
            />
          </Form.Item> */}

          <p>Guests</p>
          <div style={{ display: "flex", width: "100%", gap: 10 }}>
            <Form.Item
              name={"adults"}
              rules={rules}
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

          <Form.Item name={"dateRange"} rules={rules} label="Arrival / Depart">
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

        <Divider style={{ marginTop: 60 }} />
        <div>
          <p>Daily price: {convertNumberToDollar(dailyPrice)}</p>
          <p>
            Total: {convertNumberToDollar(daysDifference * dailyPrice)} (
            {daysDifference} days)
          </p>
        </div>
      </Modal>
    </div>
  );
};
