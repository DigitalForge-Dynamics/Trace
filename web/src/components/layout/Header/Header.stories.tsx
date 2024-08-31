import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta = {
  title: "Header",
  component: Header,
  args: {
    title: "Welcome to Trace",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
