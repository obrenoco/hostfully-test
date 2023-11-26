import React, { Fragment, useContext, useState } from "react";
import {
  Table,
  Button,
  Modal,
  DatePicker,
  Form,
  Slider,
  InputNumber,
  notification,
  Typography,
  Input,
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
import { BookingContext, BookingsProvider } from "./context/BookingsContext";
import { convertNumberToDollar } from "../../utils/currencyConverter";
import { calculateDaysDifference, dateRangeToObject } from "../../utils/dates";

export type DataType = {
  key: number;
  name: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  observations?: string;
  dateRange?: any;
};

type NotificationType = "success" | "info" | "warning" | "error";

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

const dateFormatList = ["MM/DD/YYYY", "MM/DD/YYYY"];
const primaryColor = "#2D2AA5";

export const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState(ActionMode.View);
  const [guests, setGuests] = useState(1);
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
      render: () => <Avatar size={"large"} icon={<UserOutlined />} />,
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
      render: (_, value) => <span>{convertNumberToDollar(value.price)}</span>,
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
      addBooking({
        ...item,
        key: Math.random(),
        startDate: convertedDates?.startDate,
        endDate: convertedDates?.endDate,
      });
      openNotificationWithIcon("success");
      handleCancel();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const onChangeDateRange = (value: any, valueStr: any) =>
    setDaysDifference(calculateDaysDifference(valueStr));

  const expandedRowRender = () => {
    return <h1>Hello</h1>;
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const onChangeGuests = (value: any) => {
    setGuests(value);
  };

  const handleUpdateBooking = () => {
    try {
      updateBooking(form.getFieldsValue());
      notification.success({ message: "Booking successfully updated" });
      setIsModalOpen(false);
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
        <Table
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
        />
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
          <Form.Item name={"name"} rules={rules} label="Name">
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item name={"guests"} rules={rules} label="Guests">
            <Slider
              style={{ width: "100%" }}
              min={1}
              dots
              max={10}
              onChange={onChangeGuests}
              disabled={actionMode === ActionMode.View}
              value={typeof guests === "number" ? guests : 1}
            />
          </Form.Item>

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
          <Form.Item name={"price"} rules={rules} label="Price">
            <InputNumber addonBefore="$" step={0.01} size="middle" />
          </Form.Item>
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
