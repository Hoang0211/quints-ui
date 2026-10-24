import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/Button";
import { Toast, Toaster, useToast, type ToastOptions } from "./Toast";

const meta = {
  title: "Components/Feedback/Toast",
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo({ label, options }: { label: string; options: ToastOptions }) {
  const { toast } = useToast();
  return (
    <>
      <Button variant="primary" onClick={() => toast(options)}>
        {label}
      </Button>
      <Toaster />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <ToastDemo
      label="Show toast"
      options={{ title: "Event created", description: "Friday, October 23 at 5:00 PM" }}
    />
  ),
};

export const Variants: Story = {
  render: function VariantsStory() {
    const { toast } = useToast();
    const variants = ["neutral", "success", "warning", "alert", "info"] as const;
    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {variants.map((variant) => (
          <Button
            key={variant}
            variant="neutral"
            onClick={() =>
              toast({
                variant,
                title: `${variant[0].toUpperCase()}${variant.slice(1)} toast`,
                description: "This is what a toast of this variant looks like.",
              })
            }
          >
            {variant}
          </Button>
        ))}
        <Toaster />
      </div>
    );
  },
};

export const WithAction: Story = {
  render: () => (
    <ToastDemo
      label="Delete item"
      options={{
        title: "Item deleted",
        description: "The item was moved to the trash.",
        action: { label: "Undo", altText: "Undo the deletion" },
      }}
    />
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <ToastDemo
      label="Show toast"
      options={{
        title: "Copied to clipboard",
        variant: "success",
        showCloseButton: false,
      }}
    />
  ),
};

export const TitleOnly: Story = {
  render: () => <ToastDemo label="Show toast" options={{ title: "Settings saved" }} />,
};

export const Compound: Story = {
  render: () => (
    <Toast.Provider>
      <Toast variant="info" duration={Infinity}>
        <Toast.Title>Update available</Toast.Title>
        <Toast.Description>A new version is ready. Restart to apply it.</Toast.Description>
        <Toast.Action altText="Restart the app to apply the update">Restart</Toast.Action>
      </Toast>
      <Toast.Viewport />
    </Toast.Provider>
  ),
};
