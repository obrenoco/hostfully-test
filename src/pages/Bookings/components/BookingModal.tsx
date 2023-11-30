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
import { DateRange } from "../types";
import PlaceholderImage from "../../../assets/placeholder.png";
import {
  calculateTotalNights,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "../../../utils/dates";
import { GetBookings, GetHosts, PostBooking } from "../api";

const { RangePicker } = DatePicker;

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

enum FormField {
  Id = "id",
  Name = "name",
  Image = "img",
  Property = "property",
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

type BookingModalProps = {
  isModalOpen: boolean;
  form: FormInstance<any>;
  actionMode: ActionMode;
  setActionMode: (value: React.SetStateAction<ActionMode>) => void;
  handleCancel: () => void;
  handleUpdateBooking: () => void;
  handleCreateBooking: (item: PostBooking) => Promise<void>;
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

  const onChangeProperty = (e: number) => {
    const filtered = hosts.find((property) => property.hostId === e);
    setSelectedProperty(filtered);

    form.setFieldValue(FormField.Id, filtered?.hostId);
    form.setFieldValue(FormField.Image, filtered?.img);
    form.setFieldValue(FormField.DailyPrice, filtered?.dailyPrice);
    if (form.getFieldValue(FormField.DateRange)) {
      form.setFieldValue(
        FormField.TotalNights,
        calculateTotalNights(form.getFieldValue(FormField.DateRange))
      );
      form.setFieldValue(
        FormField.TotalPrice,
        form.getFieldValue(FormField.DailyPrice) *
          calculateTotalNights(form.getFieldValue(FormField.DateRange))
      );
    } else {
      form.setFieldValue(FormField.TotalNights, 0);
      form.setFieldValue(FormField.TotalPrice, 0);
    }
  };

  const onChangeDateRange = (values: RangeValue<moment.Moment>) => {
    if (!values || values[0] === null || values[1] === null) return;
    const val: DateRange["dateRange"] = [values[0], values[1]];

    form.setFieldValue(
      FormField.TotalNights,
      calculateTotalNights(form.getFieldValue(FormField.DateRange))
    );
    form.setFieldValue(
      FormField.TotalPrice,
      form.getFieldValue(FormField.DailyPrice) *
        calculateTotalNights(form.getFieldValue(FormField.DateRange))
    );

    if (
      isOverlapingWithBlockedDates(
        val,
        form.getFieldValue(FormField.BlockedDates)
      )
    ) {
      form.setFields([
        {
          name: FormField.DateRange,
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
    form.getFieldValue(FormField.BlockedDates) || [];

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
        <Form.Item name={FormField.Id} hidden>
          <Fragment />
        </Form.Item>

        <Form.Item name={FormField.Image}>
          <img
            className="h-24 w-24 rounded-full m-auto"
            alt="Property"
            src={
              form.getFieldValue(FormField.Image) ||
              selectedProperty?.img ||
              PlaceholderImage
            }
          />
        </Form.Item>

        <Form.Item
          name={FormField.Name}
          rules={formFieldRules}
          label="Property"
        >
          <Select
            disabled={actionMode !== ActionMode.Create}
            onChange={onChangeProperty}
            options={hosts.map((option) => ({
              value: option.hostId,
              label: option.name,
            }))}
          />
        </Form.Item>

        <div className="laptop:flex laptop:justify-between laptop:gap-3">
          <Form.Item
            name={FormField.Adults}
            rules={formFieldRules}
            label="Adults"
            className="laptop:w-full"
          >
            <Select options={guestOptions.slice(1)} />
          </Form.Item>

          <Form.Item
            name={FormField.Kids}
            label="Children"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>

          <Form.Item
            name={FormField.Enfants}
            label="Enfants"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name={FormField.DateRange}
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

        <Form.Item name={FormField.BlockedDates} hidden>
          <Fragment />
        </Form.Item>

        <div className="flex items-center flex-col laptop:flex-row laptop:gap-2">
          <div className="flex items-center gap-2">
            <Form.Item
              label={"Nights"}
              name={FormField.TotalNights}
              className="w-full"
            >
              <Input disabled />
            </Form.Item>

            <span>x</span>

            <Form.Item
              label="Daily price"
              name={FormField.DailyPrice}
              className="w-full"
            >
              <Input prefix="$" disabled />
            </Form.Item>
          </div>

          <span className="hidden laptop:inline">=</span>

          <Form.Item
            label="Total price"
            name={FormField.TotalPrice}
            className="w-full"
          >
            <Input prefix="$" disabled />
          </Form.Item>
        </div>

        <Form.Item name={FormField.Observations} label="Observations">
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
