import { createRef } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Button } from "../button/Button";
import { Toast, Toaster } from "./Toast";
import { useToast, type ToastOptions } from "./useToast";

// jsdom doesn't implement these, and Radix Toast's swipe handling calls them
// on every pointerup inside a toast.
beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => {};
});

afterEach(() => {
  vi.useRealTimers();
});

function ToastTrigger({ options }: { options: ToastOptions }) {
  const { toast, dismiss } = useToast();
  return (
    <>
      <Button onClick={() => toast(options)}>Show toast</Button>
      <Button variant="neutral" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </>
  );
}

function renderToaster(options: ToastOptions = { title: "Saved" }) {
  return render(
    <>
      <ToastTrigger options={options} />
      <Toaster />
    </>,
  );
}

// Radix also copies toast text into a visually hidden live region for screen
// readers, so scope queries to the viewport to avoid matching that copy.
function getViewport() {
  return screen.getByRole("region", { name: /Notifications/ });
}

describe("Toast", () => {
  it("renders no toasts by default", () => {
    renderToaster();
    expect(within(getViewport()).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("shows a toast with title and description when toast() is called", async () => {
    const user = userEvent.setup();
    renderToaster({ title: "Saved", description: "Your changes were saved." });

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    const item = within(getViewport()).getByRole("listitem");
    expect(item).toHaveTextContent("Saved");
    expect(item).toHaveTextContent("Your changes were saved.");
  });

  it("stacks multiple toasts", async () => {
    const user = userEvent.setup();
    renderToaster();

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(screen.getByRole("button", { name: "Show toast" }));

    expect(within(getViewport()).getAllByRole("listitem")).toHaveLength(2);
  });

  it("defaults to the neutral variant with no icon", async () => {
    const user = userEvent.setup();
    renderToaster();

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    const item = within(getViewport()).getByRole("listitem");
    expect(item.className).toContain("q-toast--neutral");
    expect(item.querySelector(".q-toast__icon")).not.toBeInTheDocument();
  });

  it("applies the given variant class and its default icon", async () => {
    const user = userEvent.setup();
    renderToaster({ title: "Saved", variant: "success" });

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    const item = within(getViewport()).getByRole("listitem");
    expect(item.className).toContain("q-toast--success");
    expect(item.querySelector(".q-toast__icon svg")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderToaster();

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(within(getViewport()).getByRole("button", { name: "Close" }));

    expect(within(getViewport()).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("hides the close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    renderToaster({ title: "Saved", showCloseButton: false });

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    expect(within(getViewport()).queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("calls the action's onClick and closes the toast", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderToaster({
      title: "Item deleted",
      action: { label: "Undo", altText: "Undo the deletion", onClick },
    });

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(within(getViewport()).getByRole("button", { name: "Undo" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(within(getViewport()).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("closes all toasts when dismiss() is called", async () => {
    const user = userEvent.setup();
    renderToaster();

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await user.click(screen.getByRole("button", { name: "Dismiss all" }));

    expect(within(getViewport()).queryByRole("listitem")).not.toBeInTheDocument();
  });

  // fireEvent rather than userEvent: userEvent's internal delays hang under
  // fake timers.
  it("closes automatically after the default duration", () => {
    vi.useFakeTimers();
    renderToaster();

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(within(getViewport()).getByRole("listitem")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(within(getViewport()).queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("supports compound, controlled usage", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Toast.Provider>
        <Toast open onOpenChange={onOpenChange} variant="info" className="custom-class">
          <Toast.Title>Update available</Toast.Title>
          <Toast.Description>Restart to apply it.</Toast.Description>
        </Toast>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const item = within(getViewport()).getByRole("listitem");
    expect(item).toHaveTextContent("Update available");
    expect(item.className).toContain("q-toast--info");
    expect(item.className).toContain("custom-class");

    await user.click(within(getViewport()).getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwards the Toaster ref to the underlying viewport list", () => {
    const ref = createRef<HTMLOListElement>();
    render(<Toaster ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLOListElement);
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    renderToaster({
      title: "Item deleted",
      description: "The item was moved to the trash.",
      variant: "alert",
      action: { label: "Undo", altText: "Undo the deletion" },
    });

    await user.click(screen.getByRole("button", { name: "Show toast" }));

    const results = await axe(document.body);
    expect(results.violations).toHaveLength(0);
  });
});
