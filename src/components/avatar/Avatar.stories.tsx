import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

// External placeholder image, used only for the Storybook demo.
const PHOTO = "https://i.pravatar.cc/160?img=47";

const meta = {
  title: "Components/Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: { src: PHOTO, name: "Ada Lovelace" },
};

export const Initials: Story = {
  args: { name: "Ada Lovelace" },
};

export const CustomFallback: Story = {
  args: { name: "Quints Team", fallback: "Q" },
};

/** No `name`: decorative, with the generic icon as the fallback. */
export const DefaultFallback: Story = {
  args: {},
};

/** The image fails to load, so the initials stay. */
export const BrokenImage: Story = {
  args: { src: "/does-not-exist.jpg", name: "Grace Hopper" },
};

export const Square: Story = {
  args: { name: "Acme Inc", shape: "square" },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Avatar key={size} size={size} src={PHOTO} name="Ada Lovelace" />
      ))}
      {(["sm", "md", "lg"] as const).map((size) => (
        <Avatar key={`initials-${size}`} size={size} name="Grace Hopper" />
      ))}
    </div>
  ),
};
