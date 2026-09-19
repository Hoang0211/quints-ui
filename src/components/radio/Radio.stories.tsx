import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./Radio";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    label: "Plan",
    orientation: "vertical",
    defaultValue: "free",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    label: "Plan",
    orientation: "horizontal",
    defaultValue: "free",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    label: "Plan",
    size: "sm",
    defaultValue: "free",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Plan",
    helperText: "You can change this later",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: "Plan",
    error: true,
    errorMessage: "Plan is required",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </>
    ),
  },
};

export const WithDisabledItem: Story = {
  args: {
    label: "Plan",
    defaultValue: "free",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro" disabled>
          Pro (coming soon)
        </RadioGroup.Item>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Plan",
    disabled: true,
    defaultValue: "free",
    children: (
      <>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </>
    ),
  },
};
