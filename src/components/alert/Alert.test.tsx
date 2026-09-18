import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders with the given description", () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something happened");
  });

  it("defaults to the info variant", () => {
    render(<Alert>Default</Alert>);
    expect(screen.getByRole("alert").className).toContain("q-alert--info");
  });

  it("applies the given variant class", () => {
    render(<Alert variant="success">Saved</Alert>);
    expect(screen.getByRole("alert").className).toContain("q-alert--success");
  });

  it("renders the title when provided", () => {
    render(
      <Alert title="Heads up" variant="warning">
        Please review this.
      </Alert>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("does not render a dismiss button by default", () => {
    render(<Alert>Not dismissible</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a dismiss button and calls onDismiss when clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Dismissible
      </Alert>,
    );

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref to the underlying div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Ref test</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Alert title="Error" variant="alert" dismissible onDismiss={() => {}}>
        Something went wrong.
      </Alert>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
