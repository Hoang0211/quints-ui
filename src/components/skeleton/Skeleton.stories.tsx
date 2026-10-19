import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle"],
    },
    animation: {
      control: "select",
      options: ["pulse", "none"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: "text", width: 240 },
};

export const Rect: Story = {
  args: { variant: "rect", width: 320, height: 180 },
};

export const Circle: Story = {
  args: { variant: "circle" },
};

export const MultipleLines: Story = {
  args: { lines: 4, width: 320 },
};

export const NoAnimation: Story = {
  args: { variant: "rect", animation: "none", width: 320 },
};

/** Wraps real content: while `loading`, the skeleton takes the content's size and hides it. */
export const WrappingContent: Story = {
  args: {
    loading: true,
    children: <Button variant="primary">Follow</Button>,
  },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      role="region"
      style={{ display: "flex", gap: "1rem", width: 360 }}
    >
      <Skeleton variant="circle" width={48} />
      <div style={{ flex: 1, display: "grid", gap: "0.75rem" }}>
        <Skeleton width="40%" />
        <Skeleton lines={3} />
      </div>
    </div>
  ),
};
