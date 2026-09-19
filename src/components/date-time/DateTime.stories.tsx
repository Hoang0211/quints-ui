import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTime } from "./DateTime";

const meta = {
  title: "Components/DateTime",
  component: DateTime,
  tags: ["autodocs"],
} satisfies Meta<typeof DateTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Start date",
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Start date",
    defaultValue: new Date(),
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Start date",
    helperText: "Choose the first day of the trip",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Start date",
    error: true,
    errorMessage: "Start date is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Start date",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: "Start date",
    fullWidth: true,
  },
};
