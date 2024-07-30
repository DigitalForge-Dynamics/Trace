import type { Meta, StoryObj } from "@storybook/react";
import RecentlyAddedView from "./RecentlyAddedView";

const meta: Meta = {
  title: "Recently Added View",
  component: RecentlyAddedView,
  args: {},
} satisfies Meta<typeof RecentlyAddedView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};