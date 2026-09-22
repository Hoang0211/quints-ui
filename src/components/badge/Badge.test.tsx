import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Badge, type BadgeVariant } from "./Badge";

const VARIANTS: BadgeVariant[] = [
  "primary",
  "secondary",
  "neutral",
  "success",
  "warning",
  "alert",
  "info",
];

describe("Badge", () => {
  it("renders with the given label", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("defaults to the neutral variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default").closest(".q-badge");
    expect(badge?.className).toContain("q-badge--neutral");
  });

  it("applies the given variant class", () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText("Active").closest(".q-badge");
    expect(badge?.className).toContain("q-badge--success");
  });

  it("renders the icon when provided", () => {
    render(<Badge icon={<span data-testid="icon" />}>With icon</Badge>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render a remove button by default", () => {
    render(<Badge>Not removable</Badge>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a remove button and calls onRemove when clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Badge removable onRemove={onRemove}>
        Removable
      </Badge>,
    );

    const removeButton = screen.getByRole("button", { name: "Remove Removable" });
    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref to the underlying span element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref test</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Badge removable onRemove={() => {}}>
        Accessible
      </Badge>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it.each(VARIANTS)("has no accessibility violations for the %s variant", async (variant) => {
    const { container } = render(<Badge variant={variant}>Accessible</Badge>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
