import type { Meta, StoryObj } from "@storybook/react";
import RecentlyAddedTable from "./RecentlyAddedTable";

const meta: Meta = {
  title: "Recently Added Table",
  component: RecentlyAddedTable,
  args: {},
} satisfies Meta<typeof RecentlyAddedTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};