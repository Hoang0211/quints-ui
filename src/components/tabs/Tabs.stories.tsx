import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Manage your account details here.</Tabs.Content>
      <Tabs.Content value="password">Update your password here.</Tabs.Content>
      <Tabs.Content value="billing">View your billing history here.</Tabs.Content>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical">
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="password">Password</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <div>
          <Tabs.Content value="account">Manage your account details here.</Tabs.Content>
          <Tabs.Content value="password">Update your password here.</Tabs.Content>
          <Tabs.Content value="billing">View your billing history here.</Tabs.Content>
        </div>
      </div>
    </Tabs>
  ),
};

export const Small: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <Tabs.List size="sm">
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Manage your account details here.</Tabs.Content>
      <Tabs.Content value="password">Update your password here.</Tabs.Content>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing (unavailable)
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Manage your account details here.</Tabs.Content>
      <Tabs.Content value="billing">View your billing history here.</Tabs.Content>
    </Tabs>
  ),
};
