import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
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
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="11"
      y1="11"
      x2="15"
      y2="15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    helperText: "Choose something unique",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Password",
    type: "password",
    error: true,
    errorMessage: "Password must be at least 8 characters",
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    leftIcon: <SearchIcon />,
    placeholder: "Search...",
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
