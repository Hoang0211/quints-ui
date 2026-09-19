import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Accept terms and conditions",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    checked: "indeterminate",
  },
};

export const Small: Story = {
  args: {
    label: "Accept terms and conditions",
    size: "sm",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "You can unsubscribe at any time",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Accept terms and conditions",
    error: true,
    errorMessage: "You must accept the terms to continue",
  },
};

export const Disabled: Story = {
  args: {
    label: "Accept terms and conditions",
    disabled: true,
  },
};
