import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warning", "alert", "info"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    title: "Saved",
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Heads up",
    children: "This action can't be undone.",
  },
};

export const AlertVariant: Story = {
  name: "Alert",
  args: {
    variant: "alert",
    title: "Error",
    children: "Something went wrong. Please try again.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Note",
    children: "This feature is in beta.",
  },
};

export const NoTitle: Story = {
  args: {
    variant: "info",
    children: "A description-only alert with no title.",
  },
};

export const Dismissible: Story = {
  args: {
    variant: "success",
    title: "Saved",
    children: "Your changes have been saved successfully.",
    dismissible: true,
    onDismiss: () => alert("dismissed"),
  },
};
