import { Modal, Form, Select, DatePicker, Input, Button } from "antd";
import { Fragment } from "react";
import moment from "moment";
import { PostBookingType } from "../types/booking";

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
  onFinish: (item: PostBookingType) => Promise<void>;
  isSubmitButtonDisabled: boolean;
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
}) => {
  const modalFooter = () => {
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

  return (
    <Modal
      title={
        actionMode === ActionMode.Create ? "New booking" : "Update booking"
      }
      visible={isModalOpen}
      onCancel={handleCancel}
      style={{ top: 20 }}
      footer={modalFooter()}
    >
      <Form
        name="create"
        onFinish={onFinish}
        disabled={actionMode === ActionMode.View}
        initialValues={
          { currency: "USD", adults: 1, kids: 0, enfants: 0 } as PostBookingType
        }
        form={form}
        layout="vertical"
      >
        <Form.Item name="key" hidden>
          <Fragment />
        </Form.Item>

        <Form.Item name="adults" rules={formFieldRules} label="Adults">
          <Select options={guestOptions.slice(1)} />
        </Form.Item>

        <Form.Item name="kids" label="Children">
          <Select options={guestOptions} />
        </Form.Item>

        <Form.Item name="enfants" label="Enfants">
          <Select options={guestOptions} />
        </Form.Item>

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
