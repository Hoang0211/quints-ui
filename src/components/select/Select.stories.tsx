import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Fruit",
    placeholder: "Select a fruit",
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    label: "Fruit",
    size: "sm",
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </>
    ),
  },
};

export const WithGroups: Story = {
  args: {
    label: "Food",
    children: (
      <>
        <Select.Group>
          <Select.GroupLabel>Fruits</Select.GroupLabel>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Group>
        <Select.Group>
          <Select.GroupLabel>Vegetables</Select.GroupLabel>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="potato">Potato</Select.Item>
        </Select.Group>
      </>
    ),
  },
};

export const WithDisabledItem: Story = {
  args: {
    label: "Fruit",
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana" disabled>
          Banana (out of stock)
        </Select.Item>
      </>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Fruit",
    helperText: "Pick your favorite",
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: "Fruit",
    error: true,
    errorMessage: "Fruit is required",
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Fruit",
    disabled: true,
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    label: "Fruit",
    fullWidth: true,
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </>
    ),
  },
};
