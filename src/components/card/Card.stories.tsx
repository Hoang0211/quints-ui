import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Button } from "../button/Button";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "flat"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullComposition = (
  <>
    <Card.Header>
      <Card.Title>Plan details</Card.Title>
      <Card.Description>Everything included in this plan.</Card.Description>
    </Card.Header>
    <Card.Content>Unlimited projects, priority support, and advanced analytics.</Card.Content>
    <Card.Footer>
      <Button variant="primary" size="sm">
        Upgrade
      </Button>
    </Card.Footer>
  </>
);

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: fullComposition,
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: fullComposition,
  },
};

export const Flat: Story = {
  args: {
    variant: "flat",
    children: fullComposition,
  },
};

export const ContentOnly: Story = {
  args: {
    variant: "elevated",
    children: <Card.Content>Just a body, no header or footer.</Card.Content>,
  },
};
