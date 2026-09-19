import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea associated with its label", () => {
    render(<Textarea label="Bio" />);
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });

  it("defaults to the outline variant and md size", () => {
    render(<Textarea label="Default" />);
    const wrapper = screen.getByLabelText("Default").closest(".q-textarea");
    expect(wrapper?.className).toContain("q-textarea--outline");
    expect(wrapper?.className).toContain("q-textarea--md");
  });

  it("applies the given variant and size classes", () => {
    render(<Textarea label="Filled" variant="filled" size="sm" />);
    const wrapper = screen.getByLabelText("Filled").closest(".q-textarea");
    expect(wrapper?.className).toContain("q-textarea--filled");
    expect(wrapper?.className).toContain("q-textarea--sm");
  });

  it("renders helper text when provided", () => {
    render(<Textarea label="Bio" helperText="Tell us about yourself" />);
    expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
  });

  it("shows the error message instead of helper text and marks the textarea invalid", () => {
    render(
      <Textarea
        label="Bio"
        helperText="Tell us about yourself"
        error
        errorMessage="Bio is required"
      />,
    );
    const textarea = screen.getByLabelText("Bio");
    expect(screen.getByText("Bio is required")).toBeInTheDocument();
    expect(screen.queryByText("Tell us about yourself")).not.toBeInTheDocument();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby");
  });

  it("applies the resize modifier class", () => {
    render(<Textarea label="No resize" resize="none" />);
    expect(screen.getByLabelText("No resize").className).toContain("q-textarea__control--none");
  });

  it("disables the textarea and does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Disabled field" disabled onChange={onChange} />);

    const textarea = screen.getByLabelText("Disabled field");
    expect(textarea).toBeDisabled();

    await user.type(textarea, "hello");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Notes" onChange={onChange} />);

    await user.type(screen.getByLabelText("Notes"), "hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("forwards the ref to the underlying textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Textarea label="Accessible" helperText="Some helper text" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
