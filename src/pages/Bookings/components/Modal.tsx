import {
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Button,
  FormInstance,
} from "antd";
import { RangeValue } from "rc-picker/lib/interface";

import { Fragment, useState } from "react";
import moment from "moment";
import { DateRange, GetBookings, GetHosts, PostBooking } from "../types";
import PlaceholderImage from "../../../assets/placeholder.png";
import {
  calculateTotalNights,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "../../../utils/dates";

const { RangePicker } = DatePicker;

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

export enum BookingsFormField {
  Id = "id",
  Name = "name",
  Image = "img",
  Adults = "adults",
  Kids = "kids",
  Enfants = "enfants",
  DateRange = "dateRange",
  TotalNights = "totalNights",
  DailyPrice = "dailyPrice",
  TotalPrice = "totalPrice",
  Observations = "observations",
  BlockedDates = "blockedDates",
}

export type BookingsFormTypes = {
  [BookingsFormField.Id]: GetBookings["id"];
  [BookingsFormField.Name]: GetBookings["name"] | GetHosts["name"];
  [BookingsFormField.Image]: GetBookings["img"] | GetHosts["img"];
  [BookingsFormField.Adults]: GetBookings["adults"] | PostBooking["adults"];
  [BookingsFormField.Kids]: GetBookings["kids"] | PostBooking["kids"];
  [BookingsFormField.Enfants]: GetBookings["enfants"] | PostBooking["enfants"];
  [BookingsFormField.DateRange]: DateRange["dateRange"];
  [BookingsFormField.TotalNights]: GetBookings["totalNights"];
  [BookingsFormField.DailyPrice]:
    | GetBookings["dailyPrice"]
    | GetHosts["dailyPrice"];
  [BookingsFormField.TotalPrice]:
    | GetBookings["totalPrice"]
    | PostBooking["totalPrice"];
  [BookingsFormField.Observations]: PostBooking["observations"];
  [BookingsFormField.BlockedDates]:
    | GetBookings["blockedDates"]
    | GetHosts["blockedDates"];
};

type BookingModalProps = {
  isModalOpen: boolean;
  form: FormInstance<BookingsFormTypes>;
  actionMode: ActionMode;
  setActionMode: (value: React.SetStateAction<ActionMode>) => void;
  handleCancel: () => void;
  handleUpdateBooking: () => void;
  handleCreateBooking: (item: BookingsFormTypes) => void;
  hosts: GetHosts[];
  bookings: GetBookings[];
};

const guestOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i,
}));

const formFieldRules = [{ required: true, message: "This field is required." }];
const dateFormatList = ["MM/DD/YYYY", "MM/DD/YYYY"];

export const BookingModal: React.FC<BookingModalProps> = ({
  isModalOpen,
  form,
  actionMode,
  setActionMode,
  handleCancel,
  handleUpdateBooking,
  handleCreateBooking,
  hosts,
  bookings,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<GetHosts>();
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);
  const ModalFooter = () => {
    switch (actionMode) {
      case ActionMode.View:
        return (
          <Button
            key="edit"
            form="create"
            onClick={() => setActionMode(ActionMode.Edit)}
          >
            Edit
          </Button>
        );
      case ActionMode.Edit:
        return (
          <>
            <Button key="cancel" form="create" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              key="update"
              type="primary"
              onClick={handleUpdateBooking}
              disabled={isSubmitBtnDisabled}
            >
              Update
            </Button>
          </>
        );
      case ActionMode.Create:
        return (
          <>
            <Button key="cancel" form="create" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              form="create"
              disabled={isSubmitBtnDisabled}
            >
              Create
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const onChangeHost = (e: number) => {
    const filtered = hosts.find((property) => property.hostId === e);
    setSelectedProperty(filtered);

    form.setFieldValue(BookingsFormField.Id, filtered?.hostId);
    form.setFieldValue(BookingsFormField.Image, filtered?.img);
    form.setFieldValue(BookingsFormField.DailyPrice, filtered?.dailyPrice);
    console.log(form.getFieldValue(BookingsFormField.Name));

    form.setFieldValue(BookingsFormField.BlockedDates, filtered?.blockedDates);

    if (form.getFieldValue(BookingsFormField.DateRange)) {
      form.setFieldValue(
        BookingsFormField.TotalNights,
        calculateTotalNights(form.getFieldValue(BookingsFormField.DateRange))
      );
      form.setFieldValue(
        BookingsFormField.TotalPrice,
        form.getFieldValue(BookingsFormField.DailyPrice) *
          calculateTotalNights(form.getFieldValue(BookingsFormField.DateRange))
      );
    } else {
      form.setFieldValue(BookingsFormField.TotalNights, 0);
      form.setFieldValue(BookingsFormField.TotalPrice, 0);
    }
  };

  const onChangeDateRange = (values: RangeValue<moment.Moment>) => {
    if (!values || values[0] === null || values[1] === null) return;
    const val: DateRange["dateRange"] = [values[0], values[1]];

    form.setFieldValue(
      BookingsFormField.TotalNights,
      calculateTotalNights(form.getFieldValue(BookingsFormField.DateRange))
    );
    form.setFieldValue(
      BookingsFormField.TotalPrice,
      form.getFieldValue(BookingsFormField.DailyPrice) *
        calculateTotalNights(form.getFieldValue(BookingsFormField.DateRange))
    );

    if (
      isOverlapingWithBlockedDates(
        val,
        form.getFieldValue(BookingsFormField.BlockedDates) || []
      )
    ) {
      form.setFields([
        {
          name: BookingsFormField.DateRange,
          validating: false,
          validated: false,
          errors: ["Dates are not available"],
        },
      ]);

      setIsSubmitBtnDisabled(true);
    } else {
      setIsSubmitBtnDisabled(false);
    }
  };

  const bookingBlockedDates: GetBookings["blockedDates"] =
    form.getFieldValue(BookingsFormField.BlockedDates) || [];

  return (
    <Modal
      title={
        actionMode === ActionMode.Create ? "New booking" : "Update booking"
      }
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        setSelectedProperty(undefined);
      }}
      style={{ top: 20 }}
      footer={ModalFooter()}
    >
      <Form
        name="create"
        onFinish={handleCreateBooking}
        disabled={actionMode === ActionMode.View}
        initialValues={
          {
            adults: 1,
            kids: 0,
            enfants: 0,
          } as GetBookings
        }
        form={form}
        layout="vertical"
      >
        <Form.Item name={BookingsFormField.Id} hidden>
          <Fragment />
        </Form.Item>

        <Form.Item name={BookingsFormField.Image}>
          <img
            className="h-24 w-24 rounded-full m-auto"
            alt="Property"
            src={
              form.getFieldValue(BookingsFormField.Image) ||
              selectedProperty?.img ||
              PlaceholderImage
            }
          />
        </Form.Item>

        <Form.Item
          name={BookingsFormField.Name}
          rules={formFieldRules}
          label="Name"
        >
          <Select
            disabled={actionMode !== ActionMode.Create}
            onChange={onChangeHost}
            options={hosts.map((option) => ({
              value: option.hostId,
              label: option.name,
            }))}
          />
        </Form.Item>

        <div className="laptop:flex laptop:justify-between laptop:gap-3">
          <Form.Item
            name={BookingsFormField.Adults}
            rules={formFieldRules}
            label="Adults"
            className="laptop:w-full"
          >
            <Select options={guestOptions.slice(1)} />
          </Form.Item>

          <Form.Item
            name={BookingsFormField.Kids}
            label="Children"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>

          <Form.Item
            name={BookingsFormField.Enfants}
            label="Enfants"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name={BookingsFormField.DateRange}
          rules={formFieldRules}
          label="Arrival / Depart"
        >
          <RangePicker
            disabledDate={generateBlockedDates(bookingBlockedDates)}
            aria-required
            onChange={onChangeDateRange}
            format={dateFormatList}
            className="w-full"
          />
        </Form.Item>

        <Form.Item name={BookingsFormField.BlockedDates} hidden>
          <Fragment />
        </Form.Item>

        <div className="flex items-center flex-col laptop:flex-row laptop:gap-2">
          <div className="flex items-center w-full gap-2">
            <Form.Item
              label={"Nights"}
              name={BookingsFormField.TotalNights}
              className="w-full"
            >
              <Input disabled />
            </Form.Item>

            <span>x</span>

            <Form.Item
              label="Daily price"
              name={BookingsFormField.DailyPrice}
              className="w-full"
            >
              <Input prefix="$" disabled />
            </Form.Item>
          </div>

          <span className="hidden laptop:inline">=</span>

          <Form.Item
            label="Total price"
            name={BookingsFormField.TotalPrice}
            className="w-full"
          >
            <Input prefix="$" disabled />
          </Form.Item>
        </div>

        <Form.Item name={BookingsFormField.Observations} label="Observations">
          <Input.TextArea
            rows={4}
            maxLength={200}
            showCount
            placeholder="Notes (max. 200 characters)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
