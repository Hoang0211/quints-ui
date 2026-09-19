import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

// jsdom doesn't implement these, and Radix Select's trigger/viewport rely on
// them for pointer capture, positioning, and scrolling the highlighted item
// into view.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

describe("Select", () => {
  it("renders a trigger associated with its label", () => {
    render(
      <Select label="Fruit">
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
  });

  it("shows the placeholder when no value is selected", () => {
    render(
      <Select label="Fruit" placeholder="Pick a fruit">
        <Select.Item value="apple">Apple</Select.Item>
      </Select>,
    );
    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("opens the listbox when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Fruit">
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select>,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("calls onValueChange with the selected option and closes the listbox", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select label="Fruit" onValueChange={onValueChange}>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select>,
    );

    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("shows the error message instead of helper text and marks the trigger invalid", () => {
    render(
      <Select label="Fruit" helperText="Pick your favorite" error errorMessage="Fruit is required">
        <Select.Item value="apple">Apple</Select.Item>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(screen.getByText("Fruit is required")).toBeInTheDocument();
    expect(screen.queryByText("Pick your favorite")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("does not open the listbox when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Fruit" disabled>
        <Select.Item value="apple">Apple</Select.Item>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("data-disabled");

    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("forwards the ref to the underlying trigger element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select label="Ref test" ref={ref}>
        <Select.Item value="apple">Apple</Select.Item>
      </Select>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Select label="Fruit" helperText="Pick your favorite">
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
