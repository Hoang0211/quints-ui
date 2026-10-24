import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion";

const meta = {
  title: "Components/Data Display/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion defaultValue="shipping">
      <Accordion.Item value="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Content>Ships within 3-5 business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Content>Returns accepted within 30 days of delivery.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="warranty">
        <Accordion.Trigger>Warranty</Accordion.Trigger>
        <Accordion.Content>Covered for one year from the purchase date.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Accordion collapsible defaultValue="shipping">
      <Accordion.Item value="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Content>Ships within 3-5 business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Content>Returns accepted within 30 days of delivery.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Accordion defaultValue="shipping">
      <Accordion.Item value="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Content>Ships within 3-5 business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="warranty" disabled>
        <Accordion.Trigger>Warranty (unavailable)</Accordion.Trigger>
        <Accordion.Content>Covered for one year from the purchase date.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const AllCollapsedByDefault: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item value="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Content>Ships within 3-5 business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Content>Returns accepted within 30 days of delivery.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
