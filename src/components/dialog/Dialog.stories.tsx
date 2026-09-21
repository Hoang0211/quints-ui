import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Dialog } from "./Dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>Make changes to your profile here.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>Form fields would go here.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="neutral">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content showCloseButton={false}>
        <Dialog.Header>
          <Dialog.Title>Confirm action</Dialog.Title>
          <Dialog.Description>Use the footer buttons to dismiss this dialog.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="neutral">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const DestructiveConfirmation: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="alert">Delete item</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete item</Dialog.Title>
          <Dialog.Description>This action cannot be undone.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="neutral">Cancel</Button>
          </Dialog.Close>
          <Button variant="alert">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Heads up</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>This dialog has no description or footer.</Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
};
