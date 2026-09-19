import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./Radio";

describe("RadioGroup", () => {
  it("renders a radiogroup associated with its label", () => {
    render(
      <RadioGroup label="Plan">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
  });

  it("renders each item with its label as an accessible radio", () => {
    render(
      <RadioGroup label="Plan">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeInTheDocument();
  });

  it("calls onValueChange when an item is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Plan" onValueChange={onValueChange}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Pro" }));

    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute("aria-checked", "true");
  });

  it("moves selection with arrow keys", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Plan" defaultValue="free" onValueChange={onValueChange}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );

    const freeRadio = screen.getByRole("radio", { name: "Free" });
    freeRadio.focus();
    // Radix defers the focus move to a setTimeout and only auto-selects if the
    // arrow key is still considered "down" when it runs, so this deliberately
    // fires keydown without a paired keyup (unlike userEvent.keyboard).
    fireEvent.keyDown(freeRadio, { key: "ArrowDown" });

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveFocus();
  });

  it("shows the error message instead of helper text and marks the group invalid", () => {
    render(
      <RadioGroup label="Plan" helperText="Pick a plan" error errorMessage="Plan is required">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(screen.getByText("Plan is required")).toBeInTheDocument();
    expect(screen.queryByText("Pick a plan")).not.toBeInTheDocument();
    expect(group).toHaveAttribute("aria-invalid", "true");
  });

  it("disables every item when the group is disabled", () => {
    render(
      <RadioGroup label="Plan" disabled>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Free" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeDisabled();
  });

  it("forwards the ref to the underlying radiogroup element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup label="Plan" ref={ref}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
      </RadioGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup label="Plan" helperText="Pick a plan">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
