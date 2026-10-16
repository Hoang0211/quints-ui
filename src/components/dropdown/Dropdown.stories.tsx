import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Dropdown } from "./Dropdown";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const EditIcon = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <path
      d="M11 2.5l2.5 2.5L6 12.5H3.5V10L11 2.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 16 16" focusable="false">
    <rect
      x="5.5"
      y="5.5"
      width="8"
      height="8"
      rx="1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10.5 3.5v-1h-8v8h1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="neutral">Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Item>Archive</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const WithLabelsAndSeparators: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="neutral">My account</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Label>Account</Dropdown.Label>
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Label>Team</Dropdown.Label>
        <Dropdown.Item>Invite members</Dropdown.Item>
        <Dropdown.Item>Billing</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>Log out</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const WithIconsAndShortcuts: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="neutral">Edit</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<EditIcon />} shortcut="⌘E">
          Rename
        </Dropdown.Item>
        <Dropdown.Item icon={<CopyIcon />} shortcut="⌘D">
          Duplicate
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="neutral">Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item disabled>Archive (no permission)</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Small: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="neutral" size="sm">
          Options
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content size="sm">
        <Dropdown.Label>Actions</Dropdown.Label>
        <Dropdown.Item shortcut="⌘E">Edit</Dropdown.Item>
        <Dropdown.Item shortcut="⌘D">Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="neutral">Aligned to end</Button>
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

export const SideTop: Story = {
  render: () => (
    <div style={{ paddingTop: "10rem" }}>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="neutral">Opens upward</Button>
        </Dropdown.Trigger>
        <Dropdown.Content side="top">
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  ),
};

export const DisabledTrigger: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild disabled>
        <Button variant="neutral">Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
