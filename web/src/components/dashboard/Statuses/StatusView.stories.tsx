import type { Meta, StoryObj } from "@storybook/react";
import StatusView from "./StatusView";

const meta: Meta = {
  title: "Status View",
  component: StatusView,
  args: {},
} satisfies Meta<typeof StatusView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};