import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

function getFill() {
  return screen.getByRole("progressbar").querySelector<HTMLElement>(".q-progress__fill");
}

describe("Progress", () => {
  it("renders a progressbar with its current value and range", () => {
    render(<Progress value={42} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(getFill()?.style.width).toBe("42%");
  });

  it("defaults to the linear shape, primary variant, and md size", () => {
    render(<Progress value={10} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("q-progress--linear");
    expect(bar.className).toContain("q-progress--primary");
    expect(bar.className).toContain("q-progress--md");
  });

  it("applies the given variant and size classes", () => {
    render(<Progress value={10} variant="warning" size="lg" aria-label="Storage" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("q-progress--warning");
    expect(bar.className).toContain("q-progress--lg");
  });

  it("scales the fill to a custom max", () => {
    render(<Progress value={3} max={5} aria-label="Steps" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
    expect(getFill()?.style.width).toBe("60%");
  });

  it("clamps the value to the 0..max range", () => {
    const { rerender } = render(<Progress value={150} aria-label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(getFill()?.style.width).toBe("100%");

    rerender(<Progress value={-20} aria-label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(getFill()?.style.width).toBe("0%");
  });

  it("uses the label as the accessible name and shows the value text", () => {
    render(<Progress value={42.4} label="Uploading files" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Uploading files" });
    const valueText = screen.getByText("42%");
    expect(bar).toContainElement(valueText);
    expect(valueText).toHaveAttribute("aria-hidden", "true");
  });

  it("is indeterminate without a value, omitting aria-valuenow and the value text", () => {
    render(<Progress value={null} label="Loading" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.className).toContain("q-progress--indeterminate");
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    expect(getFill()?.style.width).toBe("");
  });

  it("renders a circular ring whose arc matches the value", () => {
    render(<Progress shape="circular" value={25} showValue aria-label="Sync" />);
    const bar = screen.getByRole("progressbar", { name: "Sync" });
    expect(bar.className).toContain("q-progress--circular");

    const arc = bar.querySelector(".q-progress__ring-fill");
    expect(arc).toHaveAttribute("pathLength", "100");
    expect(arc).toHaveAttribute("stroke-dashoffset", "75");
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("renders an indeterminate circular ring as a fixed-length arc", () => {
    render(<Progress shape="circular" aria-label="Sync" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.querySelector(".q-progress__ring-fill")).toHaveAttribute(
      "stroke-dasharray",
      "25 75",
    );
  });

  it("merges a consumer className after the generated classes", () => {
    render(<Progress value={10} className="custom" aria-label="Upload" />);
    expect(screen.getByRole("progressbar").className).toBe(
      "q-progress q-progress--linear q-progress--primary q-progress--md custom",
    );
  });

  it("forwards the ref to the progressbar element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={10} aria-label="Upload" />);
    expect(ref.current).toBe(screen.getByRole("progressbar"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <Progress value={60} label="Uploading files" showValue />
        <Progress label="Loading" />
        <Progress shape="circular" value={30} showValue aria-label="Sync" />
        <Progress shape="circular" label="Processing" />
      </>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
