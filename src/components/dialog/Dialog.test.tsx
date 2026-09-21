import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/Button";
import { Dialog } from "./Dialog";

function renderDialog(props: Partial<ComponentProps<typeof Dialog>> = {}) {
  return render(
    <Dialog {...props}>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete item</Dialog.Title>
          <Dialog.Description>This action cannot be undone.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>Are you sure you want to delete this item?</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="neutral">Cancel</Button>
          </Dialog.Close>
          <Button variant="alert">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>,
  );
}

describe("Dialog", () => {
  it("is closed by default", () => {
    renderDialog();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the dialog when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("associates the title and description via aria attributes", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Delete item");
    expect(dialog).toHaveAccessibleDescription("This action cannot be undone.");
  });

  it("closes when the built-in close button is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when a Dialog.Close button inside the footer is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides the built-in close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button variant="primary">Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content showCloseButton={false}>
          <Dialog.Title>Delete item</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <Button variant="primary">Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete item</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Open dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("has no accessibility violations", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const results = await axe(document.body);
    expect(results.violations).toHaveLength(0);
  });
});
