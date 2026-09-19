import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    labelPosition: {
      control: "select",
      options: ["left", "right"],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Enable notifications",
  },
};

export const Checked: Story = {
  args: {
    label: "Enable notifications",
    defaultChecked: true,
  },
};

export const LabelOnLeft: Story = {
  args: {
    label: "Enable notifications",
    labelPosition: "left",
  },
};

export const Small: Story = {
  args: {
    label: "Enable notifications",
    size: "sm",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Enable notifications",
    helperText: "You can change this later in settings",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Enable notifications",
    error: true,
    errorMessage: "This setting is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Enable notifications",
    disabled: true,
  },
};
