import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

// jsdom doesn't implement ResizeObserver, which Radix Tooltip's Popper-based
// positioning (shared with Popover/Select) relies on.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

describe("Tooltip", () => {
  it("does not show the tooltip content by default", () => {
    render(
      <Tooltip content="More info">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="More info" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("More info"));
  });

  it("shows the tooltip content on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="More info" delayDuration={0}>
        <button type="button">Focus me</button>
      </Tooltip>,
    );

    await user.tab();

    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("More info"));
  });

  it("supports a controlled open state", () => {
    render(
      <Tooltip content="More info" open>
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("More info");
  });

  it("applies the given side and align props", () => {
    render(
      <Tooltip content="More info" open side="right" align="start">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-side", "right");
    expect(screen.getByRole("tooltip")).toHaveAttribute("data-align", "start");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tooltip content="More info" open>
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
