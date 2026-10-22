import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("is exposed as an image named after the person", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("is decorative and hidden from assistive tech without a name", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each([
    ["Ada Lovelace", "AL"],
    ["Plato", "P"],
    ["Grace Brewster Hopper", "GH"],
    ["  ada   lovelace  ", "AL"],
  ])("derives the initials of %j as %s", (name, initials) => {
    render(<Avatar name={name} />);
    expect(screen.getByRole("img")).toHaveTextContent(initials);
  });

  it("prefers a custom fallback over the initials", () => {
    render(<Avatar name="Ada Lovelace" fallback="★" />);
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveTextContent("★");
    expect(avatar).not.toHaveTextContent("AL");
  });

  it("falls back to a generic icon without a name or fallback", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar").querySelector(".q-avatar__icon")).toBeInTheDocument();
  });

  it("shows the fallback until the image loads, then reveals the image", () => {
    render(<Avatar name="Ada Lovelace" src="/ada.jpg" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    const image = avatar.querySelector("img");

    expect(image).toHaveAttribute("src", "/ada.jpg");
    expect(image).toHaveAttribute("alt", "");
    expect(image?.className).not.toContain("q-avatar__image--loaded");
    expect(avatar).toHaveTextContent("AL");

    fireEvent.load(image!);

    expect(image?.className).toContain("q-avatar__image--loaded");
    expect(avatar).not.toHaveTextContent("AL");
  });

  it("keeps the fallback and drops the image if it fails to load", () => {
    render(<Avatar name="Ada Lovelace" src="/missing.jpg" />);
    const avatar = screen.getByRole("img");

    fireEvent.error(avatar.querySelector("img")!);

    expect(avatar.querySelector("img")).not.toBeInTheDocument();
    expect(avatar).toHaveTextContent("AL");
  });

  it("starts over when the src changes", () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" src="/ada.jpg" />);
    fireEvent.load(screen.getByRole("img").querySelector("img")!);
    expect(screen.getByRole("img")).not.toHaveTextContent("AL");

    rerender(<Avatar name="Ada Lovelace" src="/ada-new.jpg" />);

    const image = screen.getByRole("img").querySelector("img");
    expect(image).toHaveAttribute("src", "/ada-new.jpg");
    expect(image?.className).not.toContain("q-avatar__image--loaded");
    expect(screen.getByRole("img")).toHaveTextContent("AL");
  });

  it("defaults to the md size and circle shape, and applies the given ones", () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img").className).toContain("q-avatar--md");
    expect(screen.getByRole("img").className).toContain("q-avatar--circle");

    rerender(<Avatar name="Ada Lovelace" size="lg" shape="square" />);
    expect(screen.getByRole("img").className).toContain("q-avatar--lg");
    expect(screen.getByRole("img").className).toContain("q-avatar--square");
  });

  it("merges a consumer className after the generated classes", () => {
    render(<Avatar name="Ada Lovelace" className="custom" />);
    expect(screen.getByRole("img").className).toBe("q-avatar q-avatar--md q-avatar--circle custom");
  });

  it("forwards the ref to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Ada Lovelace" />);
    expect(ref.current).toBe(screen.getByRole("img"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <Avatar name="Ada Lovelace" src="/ada.jpg" />
        <Avatar name="Grace Hopper" shape="square" size="lg" />
        <Avatar />
      </>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
