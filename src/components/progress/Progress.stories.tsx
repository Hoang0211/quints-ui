import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "alert", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["linear", "circular"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60, "aria-label": "Progress" },
};

export const WithLabelAndValue: Story = {
  args: { value: 42, label: "Uploading files", showValue: true },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {(["primary", "success", "warning", "alert", "info"] as const).map((variant) => (
        <Progress key={variant} value={65} variant={variant} label={variant} showValue />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress key={size} value={50} size={size} label={size} />
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { label: "Loading" },
};

export const Circular: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress key={size} shape="circular" size={size} value={72} showValue label={size} />
      ))}
    </div>
  ),
};

export const CircularIndeterminate: Story = {
  args: { shape: "circular", label: "Processing" },
};
