import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { DateTime } from "./DateTime";

// jsdom doesn't implement ResizeObserver, which Radix Popover's positioning relies on.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

describe("DateTime", () => {
  it("renders a trigger associated with its label", () => {
    render(<DateTime label="Start date" />);
    expect(screen.getByRole("button", { name: /start date/i })).toBeInTheDocument();
  });

  it("shows the placeholder when no date is selected", () => {
    render(<DateTime label="Start date" placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("opens the calendar grid when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DateTime label="Start date" />);

    await user.click(screen.getByRole("button", { name: /start date/i }));

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("calls onChange with the clicked day and closes the calendar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTime label="Start date" defaultValue={new Date(2026, 0, 15)} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: /start date/i }));
    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByRole("gridcell", { name: "January 20, 2026" }));

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 20));
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("updates the trigger label after a date is selected", async () => {
    const user = userEvent.setup();
    render(<DateTime label="Start date" defaultValue={new Date(2026, 0, 15)} />);

    await user.click(screen.getByRole("button", { name: /start date/i }));
    const grid = screen.getByRole("grid");
    await user.click(within(grid).getByRole("gridcell", { name: "January 20, 2026" }));

    expect(screen.getByText("January 20, 2026")).toBeInTheDocument();
  });

  it("shows the error message instead of helper text and marks the trigger invalid", () => {
    render(
      <DateTime
        label="Start date"
        helperText="Pick a start date"
        error
        errorMessage="Start date is required"
      />,
    );
    const trigger = screen.getByRole("button", { name: /start date/i });
    expect(screen.getByText("Start date is required")).toBeInTheDocument();
    expect(screen.queryByText("Pick a start date")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });

  it("does not open the calendar when disabled", async () => {
    const user = userEvent.setup();
    render(<DateTime label="Start date" disabled />);

    const trigger = screen.getByRole("button", { name: /start date/i });
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("forwards the ref to the underlying trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DateTime label="Ref test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DateTime label="Accessible" helperText="Some helper text" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
