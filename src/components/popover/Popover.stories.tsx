import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Popover } from "./Popover";

const meta = {
  title: "Components/Overlays/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="neutral">Show details</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Storage</Popover.Title>
        <Popover.Description>You've used 7.2 GB of your 10 GB plan.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="neutral">Show details</Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Title>Storage</Popover.Title>
        <Popover.Description>You've used 7.2 GB of your 10 GB plan.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="neutral">Show details</Button>
      </Popover.Trigger>
      <Popover.Content showCloseButton>
        <Popover.Title>Storage</Popover.Title>
        <Popover.Description>You've used 7.2 GB of your 10 GB plan.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

/** Clicking or focusing outside doesn't dismiss it; only the close button, the trigger, or Escape do. */
export const CloseButtonOnly: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="neutral">Show details</Button>
      </Popover.Trigger>
      <Popover.Content showCloseButton onInteractOutside={(event) => event.preventDefault()}>
        <Popover.Title>Storage</Popover.Title>
        <Popover.Description>
          Clicking outside won't close this. Use the close button or press Escape.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", padding: "6rem", justifyContent: "center" }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <Popover.Trigger asChild>
            <Button variant="neutral">{side}</Button>
          </Popover.Trigger>
          <Popover.Content side={side} showArrow aria-label={`${side} popover`}>
            <Popover.Description>Opens on the {side} side.</Popover.Description>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
};
