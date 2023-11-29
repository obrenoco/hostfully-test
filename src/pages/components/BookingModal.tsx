import { Modal, Form, Select, DatePicker, Input, Button } from "antd";
import { Fragment, useState } from "react";
import moment from "moment";
import { BookingType, DateRange } from "../../types/booking";
import PlaceholderImage from "../../assets/placeholder.png";

const { RangePicker } = DatePicker;

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

type BookingModalProps = {
  isModalOpen: boolean;
  form: any;
  actionMode: ActionMode;
  setActionMode: (value: React.SetStateAction<ActionMode>) => void;
  handleCancel: () => void;
  handleUpdateBooking: () => void;
  onChangeDateRange: any;
  disabledDate: (date: moment.Moment) => boolean;
  onFinish: (item: BookingType & DateRange) => Promise<void>;
  isSubmitButtonDisabled: boolean;
  totalNights: number;
  availableBookings: BookingType[];
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
  onChangeDateRange,
  disabledDate,
  onFinish,
  isSubmitButtonDisabled,
  totalNights,
  availableBookings,
}) => {
  console.log(availableBookings);

  const [selectedProperty, setSelectedProperty] = useState<BookingType>();

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
              disabled={isSubmitButtonDisabled}
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
              disabled={isSubmitButtonDisabled}
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
    const filtered = availableBookings.filter((property) => property.key === e);
    setSelectedProperty(filtered[0]);
  };

  return (
    <Modal
      title={
        actionMode === ActionMode.Create ? "New booking" : "Update booking"
      }
      open={isModalOpen}
      onCancel={handleCancel}
      style={{ top: 20 }}
      footer={ModalFooter()}
    >
      <Form
        name="create"
        onFinish={onFinish}
        disabled={actionMode === ActionMode.View}
        initialValues={
          {
            adults: 1,
            kids: 0,
            enfants: 0,
          } as BookingType
        }
        form={form}
        layout="vertical"
      >
        <Form.Item name="key" hidden>
          <Fragment />
        </Form.Item>

        <Form.Item name="img">
          <img
            className="h-24 w-24 rounded-full m-auto"
            alt="Property"
            src={selectedProperty?.img || PlaceholderImage}
          />
        </Form.Item>

        <Form.Item name="property" rules={formFieldRules} label="Property">
          <Select
            onChange={onChangeProperty}
            options={availableBookings.map((option) => ({
              value: option.key,
              label: option.name,
            }))}
          />
        </Form.Item>

        <div className="laptop:flex laptop:justify-between laptop:gap-3">
          <Form.Item
            name="adults"
            rules={formFieldRules}
            label="Adults"
            className="laptop:w-full"
          >
            <Select options={guestOptions.slice(1)} />
          </Form.Item>

          <Form.Item name="kids" label="Children" className="laptop:w-full">
            <Select options={guestOptions} />
          </Form.Item>

          <Form.Item name="enfants" label="Enfants" className="laptop:w-full">
            <Select options={guestOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name="dateRange"
          rules={formFieldRules}
          label="Arrival / Depart"
        >
          <RangePicker
            disabledDate={disabledDate}
            aria-required
            onChange={onChangeDateRange}
            format={dateFormatList}
          />
        </Form.Item>

        <p>Total nights: {totalNights}</p>
        {/* <p>Total price: {totalNights}</p> */}

        <Form.Item name="observations" label="Observations">
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
