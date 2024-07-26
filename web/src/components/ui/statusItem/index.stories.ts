import type { Meta, StoryObj } from "@storybook/react";

import StatusItem from ".";

const meta: Meta = {
    title: "Status Item",
    component: StatusItem
} satisfies Meta<typeof StatusItem>;

export default meta;

type Story = StoryObj<typeof meta>;