import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "center", padding: "6rem" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "Saves your changes",
    children: <Button variant="primary">Save</Button>,
  },
};

export const Top: Story = {
  args: {
    content: "Appears above the trigger",
    side: "top",
    children: <Button variant="neutral">Top</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Appears to the right",
    side: "right",
    children: <Button variant="neutral">Right</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Appears below the trigger",
    side: "bottom",
    children: <Button variant="neutral">Bottom</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Appears to the left",
    side: "left",
    children: <Button variant="neutral">Left</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "Tooltip content wraps once it hits the max width, instead of stretching indefinitely across the screen.",
    children: <Button variant="neutral">Hover for details</Button>,
  },
};
