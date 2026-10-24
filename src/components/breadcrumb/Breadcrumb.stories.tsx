import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const CustomSeparator: Story = {
  args: { separator: "/" },
};

export const Collapsed: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Ellipsis />
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Forms</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>TextField</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  ),
};
