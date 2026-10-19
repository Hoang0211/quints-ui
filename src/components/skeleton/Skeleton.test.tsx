import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder hidden from assistive tech", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to the text variant with the pulse animation", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("q-skeleton--text");
    expect(skeleton.className).toContain("q-skeleton--pulse");
  });

  it("applies the given variant and animation classes", () => {
    render(<Skeleton data-testid="skeleton" variant="circle" animation="none" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("q-skeleton--circle");
    expect(skeleton.className).toContain("q-skeleton--none");
    expect(skeleton.className).not.toContain("q-skeleton--pulse");
  });

  it("applies width and height, merging a consumer style", () => {
    render(
      <Skeleton
        data-testid="skeleton"
        variant="rect"
        width={200}
        height="4rem"
        style={{ marginTop: 8 }}
      />,
    );
    // Inline style rather than toHaveStyle(): jsdom's computed style resolves
    // rem to px, which would obscure what was actually passed through.
    const { style } = screen.getByTestId("skeleton");
    expect(style.width).toBe("200px");
    expect(style.height).toBe("4rem");
    expect(style.marginTop).toBe("8px");
  });

  it("renders the given number of text lines", () => {
    render(<Skeleton data-testid="skeleton" lines={3} className="custom" />);
    const group = screen.getByTestId("skeleton");
    expect(group.className).toBe("q-skeleton__lines custom");
    expect(group).toHaveAttribute("aria-hidden", "true");
    expect(group.querySelectorAll(".q-skeleton--text")).toHaveLength(3);
  });

  it("ignores lines for non-text variants", () => {
    render(<Skeleton data-testid="skeleton" variant="rect" lines={3} />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("q-skeleton--rect");
    expect(skeleton.children).toHaveLength(0);
  });

  it("renders children instead of the skeleton when loading is false", () => {
    render(
      <Skeleton loading={false}>
        <h2>Article title</h2>
      </Skeleton>,
    );
    const heading = screen.getByRole("heading", { name: "Article title" });
    expect(heading.closest(".q-skeleton")).toBeNull();
  });

  it("hides wrapped children while loading, sizing the skeleton to them", () => {
    render(
      <Skeleton data-testid="skeleton">
        <h2>Article title</h2>
      </Skeleton>,
    );
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("q-skeleton--has-children");
    expect(skeleton.querySelector(".q-skeleton__content h2")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("merges a consumer className after the generated classes", () => {
    render(<Skeleton data-testid="skeleton" variant="rect" className="custom" />);
    expect(screen.getByTestId("skeleton").className).toBe(
      "q-skeleton q-skeleton--rect q-skeleton--pulse custom",
    );
  });

  it("forwards the ref to the underlying span element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no accessibility violations inside a busy region", async () => {
    const { container } = render(
      <div aria-busy="true" aria-label="Loading profile" role="region">
        <Skeleton variant="circle" />
        <Skeleton lines={2} />
        <Skeleton>
          <button type="button">Follow</button>
        </Skeleton>
      </div>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
