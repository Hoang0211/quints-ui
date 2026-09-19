import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders a switch associated with its label", () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
  });

  it("is off by default", () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("toggles state and calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle label="Enable notifications" onCheckedChange={onCheckedChange} />);

    const toggle = screen.getByRole("switch", { name: "Enable notifications" });
    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("renders the label before the control when labelPosition is left", () => {
    render(<Toggle label="Enable notifications" labelPosition="left" />);
    const row = screen.getByRole("switch", { name: "Enable notifications" }).parentElement;
    expect(row?.firstElementChild?.tagName).toBe("LABEL");
  });

  it("renders the label after the control when labelPosition is right", () => {
    render(<Toggle label="Enable notifications" labelPosition="right" />);
    const row = screen.getByRole("switch", { name: "Enable notifications" }).parentElement;
    expect(row?.lastElementChild?.tagName).toBe("LABEL");
  });

  it("shows the error message instead of helper text and marks the switch invalid", () => {
    render(
      <Toggle
        label="Enable notifications"
        helperText="You can change this later"
        error
        errorMessage="This setting is required"
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Enable notifications" });
    expect(screen.getByText("This setting is required")).toBeInTheDocument();
    expect(screen.queryByText("You can change this later")).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-invalid", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle label="Enable notifications" disabled onCheckedChange={onCheckedChange} />);

    const toggle = screen.getByRole("switch", { name: "Enable notifications" });
    expect(toggle).toBeDisabled();

    await user.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the underlying switch element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Toggle label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Toggle label="Accessible" helperText="Some helper text" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
