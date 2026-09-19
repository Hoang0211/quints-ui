import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders an input associated with its label", () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("defaults to the outline variant and md size", () => {
    render(<TextField label="Default" />);
    const wrapper = screen.getByLabelText("Default").closest(".q-text-field");
    expect(wrapper?.className).toContain("q-text-field--outline");
    expect(wrapper?.className).toContain("q-text-field--md");
  });

  it("applies the given variant and size classes", () => {
    render(<TextField label="Filled" variant="filled" size="sm" />);
    const wrapper = screen.getByLabelText("Filled").closest(".q-text-field");
    expect(wrapper?.className).toContain("q-text-field--filled");
    expect(wrapper?.className).toContain("q-text-field--sm");
  });

  it("renders helper text when provided", () => {
    render(<TextField label="Username" helperText="Choose something unique" />);
    expect(screen.getByText("Choose something unique")).toBeInTheDocument();
  });

  it("shows the error message instead of helper text and marks the input invalid", () => {
    render(
      <TextField
        label="Password"
        helperText="At least 8 characters"
        error
        errorMessage="Password is too short"
      />,
    );
    const input = screen.getByLabelText("Password");
    expect(screen.getByText("Password is too short")).toBeInTheDocument();
    expect(screen.queryByText("At least 8 characters")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
  });

  it("renders left and right icons", () => {
    render(
      <TextField
        label="Amount"
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("disables the input and does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Disabled field" disabled onChange={onChange} />);

    const input = screen.getByLabelText("Disabled field");
    expect(input).toBeDisabled();

    await user.type(input, "hello");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Name" onChange={onChange} />);

    await user.type(screen.getByLabelText("Name"), "hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("forwards the ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TextField label="Accessible" helperText="Some helper text" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
