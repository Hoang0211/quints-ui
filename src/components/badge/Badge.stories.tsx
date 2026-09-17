import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "neutral", "success", "warning", "alert", "info"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral" },
};

export const Success: Story = {
  args: { variant: "success", children: "Success" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Warning" },
};

export const Alert: Story = {
  args: { variant: "alert", children: "Alert" },
};

export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

export const WithIcon: Story = {
  args: {
    icon: <span aria-hidden="true">★</span>,
    children: "Starred",
  },
};

export const Removable: Story = {
  args: {
    removable: true,
    children: "Removable",
    onRemove: () => alert("removed"),
  },
};
