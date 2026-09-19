import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox associated with its label", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("toggles checked state and calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("renders the indeterminate state", () => {
    render(<Checkbox label="Select all" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("shows the error message instead of helper text and marks the checkbox invalid", () => {
    render(
      <Checkbox
        label="Accept terms"
        helperText="You must accept to continue"
        error
        errorMessage="You must accept the terms"
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
    expect(screen.queryByText("You must accept to continue")).not.toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" disabled onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the underlying checkbox element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox label="Accessible" helperText="Some helper text" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
