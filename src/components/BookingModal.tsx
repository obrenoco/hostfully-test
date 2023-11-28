import {
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  FormInstance,
  Button,
} from "antd";
import { Fragment } from "react";
import { PostBookingType } from "../types/booking";

enum ActionMode {
  View = 0,
  Edit = 1,
  Create = 2,
}

type BookingModalType = {
  isModalOpen: boolean;
  actionMode: ActionMode;
  setActionMode: (value: React.SetStateAction<ActionMode>) => void;
  form: FormInstance<any>;
  handleCancel: () => void;
  handleUpdateBooking: () => void;
  onChangeDateRange: any;
  // onChangeDateRange: (_: any, valueArray: string[]) => void;
  disabledDate: (
    bookings: PostBookingType[]
  ) => (date: moment.Moment) => boolean;
  onFinish: (item: PostBookingType) => Promise<void>;
  bookings: PostBookingType[];
  isSubmitButtonDisabled: boolean;
};

const formFieldRules = [{ required: true, message: "This field is required." }];
const dateFormatList = ["MM/DD/YYYY", "MM/DD/YYYY"];

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

export const BookingModal = ({
  isModalOpen,
  form,
  actionMode,
  setActionMode,
  handleCancel,
  handleUpdateBooking,
  onChangeDateRange,
  disabledDate,
  onFinish,
  bookings,
  isSubmitButtonDisabled,
}: BookingModalType) => {
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
          <Button
            key="update"
            type="primary"
            onClick={handleUpdateBooking}
            disabled={isSubmitButtonDisabled}
          >
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
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="create"
            disabled={isSubmitButtonDisabled}
          >
            Create
          </Button>
        </div>
      );
    }
    return;
  };

  return (
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
        initialValues={
          { currency: "USD", adults: 1, kids: 0, enfants: 0 } as PostBookingType
        }
        form={form}
        layout="vertical"
      >
        <Form.Item name={"key"} hidden>
          <Fragment />
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
          <Form.Item name={"enfants"} style={{ width: "100%" }} label="Enfants">
            <Select options={guestOptions} />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Form.Item
            name={"dateRange"}
            rules={formFieldRules}
            label="Arrival / Depart"
          >
            <DatePicker.RangePicker
              disabledDate={disabledDate(bookings)}
              aria-required
              onChange={onChangeDateRange}
              format={dateFormatList}
              key={1}
            />
          </Form.Item>
        </div>

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
  );
};
