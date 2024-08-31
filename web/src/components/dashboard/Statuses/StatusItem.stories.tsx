import type { Meta, StoryObj } from "@storybook/react";
import StatusItem from "./StatusItem";
import { Status } from "../../../utils/types/attributes";

const meta: Meta = {
  title: "Status Item",
  component: StatusItem,
  args: {
    statusTotal: 1,
    statusType: Status.UNKNOWN,
  },
} satisfies Meta<typeof StatusItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unknown: Story = {
  args: {},
};

export const Unserviceable: Story = {
  args: {
    statusTotal: 1,
    statusType: Status.UNSERVICEABLE,
  },
};

export const InMaintenance: Story = {
  args: {
    statusTotal: 1,
    statusType: Status.IN_MAINTENANCE,
  },
};

export const Serviceable: Story = {
  args: {
    statusTotal: 1,
    statusType: Status.SERVICEABLE,
  },
};