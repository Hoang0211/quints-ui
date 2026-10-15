import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./Accordion";

function renderAccordion(props: Partial<ComponentProps<typeof Accordion>> = {}) {
  return render(
    <Accordion {...props}>
      <Accordion.Item value="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Content>Ships within 3-5 business days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Content>Returns accepted within 30 days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="warranty" disabled>
        <Accordion.Trigger>Warranty</Accordion.Trigger>
        <Accordion.Content>Covered for one year.</Accordion.Content>
      </Accordion.Item>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renders each item's trigger, collapsed by default", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands an item when its trigger is clicked", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByRole("button", { name: "Shipping" }));

    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Ships within 3-5 business days.")).toBeVisible();
  });

  it("closes the previously open item when a different item opens (single type)", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByRole("button", { name: "Shipping" }));
    await user.click(screen.getByRole("button", { name: "Returns" }));

    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("does not allow closing the open item unless collapsible is set", async () => {
    const user = userEvent.setup();
    renderAccordion();

    const trigger = screen.getByRole("button", { name: "Shipping" });
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("allows closing the open item when collapsible is set", async () => {
    const user = userEvent.setup();
    renderAccordion({ collapsible: true });

    const trigger = screen.getByRole("button", { name: "Shipping" });
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onValueChange when the open item changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderAccordion({ onValueChange });

    await user.click(screen.getByRole("button", { name: "Shipping" }));

    expect(onValueChange).toHaveBeenCalledWith("shipping");
  });

  it("moves focus between triggers with arrow keys", async () => {
    const user = userEvent.setup();
    renderAccordion();

    screen.getByRole("button", { name: "Shipping" }).focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("button", { name: "Returns" })).toHaveFocus();
  });

  it("disables an item's trigger", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: "Warranty" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderAccordion({ defaultValue: "shipping" });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
