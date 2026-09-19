import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "filled"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "both"],
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "Bio",
    placeholder: "Tell us about yourself",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Bio",
    placeholder: "Tell us about yourself",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    helperText: "Max 500 characters",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Bio",
    error: true,
    errorMessage: "Bio is required",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Small",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    label: "Medium",
  },
};

export const NoResize: Story = {
  args: {
    label: "No resize",
    resize: "none",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
    value: "Can't edit this",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full width",
    fullWidth: true,
  },
};
