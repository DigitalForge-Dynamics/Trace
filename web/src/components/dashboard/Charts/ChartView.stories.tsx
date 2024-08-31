import type { Meta, StoryObj } from "@storybook/react";

import ChartView from "./ChartView";

const meta: Meta = {
  title: "Chart View",
  component: ChartView,
  args: {
    labels: ["Assets"],
    data: {
        assets: 1
    }
  },
} satisfies Meta<typeof ChartView>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Primary: Story = {
  args: {},
};
