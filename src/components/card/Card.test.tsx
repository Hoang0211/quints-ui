import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children inside the card container", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("defaults to the elevated variant", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content").className).toContain("q-card--elevated");
  });

  it("applies the given variant class", () => {
    render(<Card variant="outlined">Content</Card>);
    expect(screen.getByText("Content").className).toContain("q-card--outlined");
  });

  it("renders a full composition with all sub-components", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Plan details</Card.Title>
          <Card.Description>Everything included in this plan.</Card.Description>
        </Card.Header>
        <Card.Content>Body content</Card.Content>
        <Card.Footer>Footer actions</Card.Footer>
      </Card>,
    );

    expect(screen.getByRole("heading", { name: "Plan details", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("Everything included in this plan.")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("forwards the ref to the underlying div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref test</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Accessible card</Card.Title>
          <Card.Description>A description.</Card.Description>
        </Card.Header>
        <Card.Content>Body content</Card.Content>
      </Card>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
