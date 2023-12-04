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
import { BookingsFormTypes, DateRange, GetBookings, GetHosts } from "../types";
import PlaceholderImage from "../../../assets/placeholder.png";
import {
  calculateTotalNights,
  calendarDateFormat,
  generateBlockedDates,
  isOverlapingWithBlockedDates,
} from "../../../utils/dates";
import { ActionMode, BookingsFormFields } from "../enum";

type ViewEditBookingModalProps = {
  isModalOpen: boolean;
  form: FormInstance<BookingsFormTypes>;
  actionMode: ActionMode;
  setActionMode: (value: React.SetStateAction<ActionMode>) => void;
  handleCancel: () => void;
  handleUpdateBooking: () => void;
  handleCreateBooking: (item: BookingsFormTypes) => void;
  hosts: GetHosts[];
};

type ViewEditModalFooterProps = {
  actionMode: ViewEditBookingModalProps["actionMode"];
  setActionMode: ViewEditBookingModalProps["setActionMode"];
  handleCancel: ViewEditBookingModalProps["handleCancel"];
  handleUpdateBooking: ViewEditBookingModalProps["handleUpdateBooking"];
  isSubmitBtnDisabled: boolean;
};

type DeleteBookingModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
  handleDeleteBooking: (booking: GetBookings) => void;
  booking: GetBookings;
};

const guestOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i,
}));

const formFieldRules = [{ required: true, message: "This field is required." }];

const CreateUpdateModalFooter = ({
  actionMode,
  setActionMode,
  handleCancel,
  handleUpdateBooking,
  isSubmitBtnDisabled,
}: ViewEditModalFooterProps) => {
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

export const CreateUpdateBookingModal: React.FC<ViewEditBookingModalProps> = ({
  isModalOpen,
  form,
  actionMode,
  setActionMode,
  handleCancel,
  handleUpdateBooking,
  handleCreateBooking,
  hosts,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<GetHosts>();
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);

  const onChangeHost = (selectedHostId: number) => {
    const selectedHost = hosts.find((host) => host.hostId === selectedHostId);
    if (selectedHost) {
      setSelectedProperty(selectedHost);

      const { hostId, img, dailyPrice, blockedDates } = selectedHost;
      form.setFieldsValue({
        [BookingsFormFields.Id]: hostId,
        [BookingsFormFields.Image]: img,
        [BookingsFormFields.DailyPrice]: dailyPrice,
        [BookingsFormFields.BlockedDates]: blockedDates || [],
      });

      const dateRange = form.getFieldValue(BookingsFormFields.DateRange);
      if (dateRange) {
        const totalNights = calculateTotalNights(dateRange);
        const totalPrice = dailyPrice * totalNights;

        form.setFieldsValue({
          [BookingsFormFields.TotalNights]: totalNights,
          [BookingsFormFields.TotalPrice]: totalPrice,
        });
      } else {
        form.setFieldsValue({
          [BookingsFormFields.TotalNights]: 0,
          [BookingsFormFields.TotalPrice]: 0,
        });
      }
    }
  };

  const onChangeDateRange = (values: RangeValue<moment.Moment>) => {
    if (!values || values[0] === null || values[1] === null) return;
    const dateRange: DateRange["dateRange"] = [values[0], values[1]];

    form.setFieldsValue({
      [BookingsFormFields.TotalNights]: calculateTotalNights(
        form.getFieldValue(BookingsFormFields.DateRange)
      ),
      [BookingsFormFields.TotalPrice]:
        form.getFieldValue(BookingsFormFields.DailyPrice) *
        calculateTotalNights(form.getFieldValue(BookingsFormFields.DateRange)),
    });

    if (
      isOverlapingWithBlockedDates(
        dateRange,
        form.getFieldValue(BookingsFormFields.BlockedDates) || []
      )
    ) {
      form.setFields([
        {
          name: BookingsFormFields.DateRange,
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
    form.getFieldValue(BookingsFormFields.BlockedDates) || [];

  return (
    <Modal
      forceRender
      title={
        (actionMode === ActionMode.Create && "New booking") ||
        (actionMode === ActionMode.View && "View booking") ||
        (actionMode === ActionMode.Edit && "Edit booking")
      }
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        setSelectedProperty(undefined);
      }}
      className="top-5"
      footer={CreateUpdateModalFooter({
        actionMode,
        handleCancel,
        handleUpdateBooking,
        isSubmitBtnDisabled,
        setActionMode,
      })}
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
        <Form.Item name={BookingsFormFields.Id} hidden>
          <Fragment />
        </Form.Item>

        <Form.Item name={BookingsFormFields.Image}>
          <img
            className="h-24 w-24 rounded-full m-auto"
            alt="Property"
            src={
              form.getFieldValue(BookingsFormFields.Image) ||
              selectedProperty?.img ||
              PlaceholderImage
            }
          />
        </Form.Item>

        <Form.Item
          name={BookingsFormFields.Name}
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

        <Form.Item name={BookingsFormFields.HostId} hidden>
          <Fragment />
        </Form.Item>

        <div className="laptop:flex laptop:justify-between laptop:gap-3">
          <Form.Item
            name={BookingsFormFields.Adults}
            rules={formFieldRules}
            label="Adults"
            className="laptop:w-full"
          >
            <Select options={guestOptions.slice(1)} />
          </Form.Item>

          <Form.Item
            name={BookingsFormFields.Kids}
            label="Children"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>

          <Form.Item
            name={BookingsFormFields.Enfants}
            label="Enfants"
            className="laptop:w-full"
          >
            <Select options={guestOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name={BookingsFormFields.DateRange}
          rules={formFieldRules}
          label="Arrival / Depart"
        >
          <DatePicker.RangePicker
            disabledDate={generateBlockedDates(bookingBlockedDates)}
            aria-required
            onChange={onChangeDateRange}
            format={calendarDateFormat}
            className="w-full"
          />
        </Form.Item>

        <Form.Item name={BookingsFormFields.BlockedDates} hidden>
          <Fragment />
        </Form.Item>

        <div className="flex items-center flex-col laptop:flex-row laptop:gap-2">
          <div className="flex items-center w-full gap-2">
            <Form.Item
              label={"Nights"}
              name={BookingsFormFields.TotalNights}
              className="w-full"
            >
              <Input disabled />
            </Form.Item>

            <span>x</span>

            <Form.Item
              label="Daily price"
              name={BookingsFormFields.DailyPrice}
              className="w-full"
            >
              <Input prefix="$" disabled />
            </Form.Item>
          </div>

          <span className="hidden laptop:inline">=</span>

          <Form.Item
            label="Total price"
            name={BookingsFormFields.TotalPrice}
            className="w-full"
          >
            <Input prefix="$" disabled />
          </Form.Item>
        </div>

        <Form.Item name={BookingsFormFields.Observations} label="Observations">
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

export const DeleteBookingModal = ({
  isModalOpen,
  setIsModalOpen,
  handleDeleteBooking,
  booking,
}: DeleteBookingModalProps) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title="Delete booking"
      footer={
        <>
          <>
            <Button
              key="cancel"
              form="create"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              key="update"
              type="primary"
              onClick={() => handleDeleteBooking(booking)}
            >
              Delete
            </Button>
          </>
        </>
      }
    >
      <span>Are you sure you want to delete this booking?</span>
    </Modal>
  );
};
