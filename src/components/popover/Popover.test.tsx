import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Button } from "../button/Button";
import { Popover, type PopoverContentProps } from "./Popover";

// jsdom doesn't implement ResizeObserver, which Radix Popover's positioning
// relies on.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

function renderPopover(contentProps: PopoverContentProps = {}) {
  return render(
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="neutral">Filters</Button>
      </Popover.Trigger>
      <Popover.Content {...contentProps}>
        <Popover.Title>Filter results</Popover.Title>
        <Popover.Description>Narrow down the list of items.</Popover.Description>
      </Popover.Content>
    </Popover>,
  );
}

describe("Popover", () => {
  it("renders a closed trigger button", () => {
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the content when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("names and describes the content via its Title and Description", async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole("button", { name: "Filters" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Filter results");
    expect(dialog).toHaveAccessibleDescription("Narrow down the list of items.");
  });

  it("omits aria-labelledby and aria-describedby without a Title or Description", () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Quick note">Some text</Popover.Content>
      </Popover>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(dialog).not.toHaveAttribute("aria-describedby");
    expect(dialog).toHaveAccessibleName("Quick note");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole("button", { name: "Filters" });

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside the content", async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(document.body);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open on outside clicks when onInteractOutside prevents it, closing only via the close button", async () => {
    const user = userEvent.setup();
    renderPopover({
      showCloseButton: true,
      onInteractOutside: (event) => event.preventDefault(),
    });

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(document.body);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides the close button and arrow by default", async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    expect(document.querySelector(".q-popover__arrow")).not.toBeInTheDocument();
  });

  it("renders a close button that closes the content when showCloseButton", async () => {
    const user = userEvent.setup();
    renderPopover({ showCloseButton: true });

    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog").className).toContain("q-popover__content--closable");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an arrow when showArrow", async () => {
    const user = userEvent.setup();
    renderPopover({ showArrow: true });

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(document.querySelector(".q-popover__arrow")).toBeInTheDocument();
  });

  it("closes when a custom Popover.Close is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Settings</Popover.Title>
          <Popover.Close asChild>
            <Button variant="primary">Done</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaults the content to bottom side and center alignment", () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Settings</Popover.Title>
        </Popover.Content>
      </Popover>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-side", "bottom");
    expect(dialog).toHaveAttribute("data-align", "center");
  });

  it("applies the given side and align", () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content side="right" align="start">
          <Popover.Title>Settings</Popover.Title>
        </Popover.Content>
      </Popover>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-side", "right");
    expect(dialog).toHaveAttribute("data-align", "start");
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Settings</Popover.Title>
        </Popover.Content>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("merges a consumer className after the generated classes", () => {
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content className="custom">
          <Popover.Title className="custom-title">Settings</Popover.Title>
          <Popover.Description className="custom-description">Details</Popover.Description>
        </Popover.Content>
      </Popover>,
    );
    expect(screen.getByRole("dialog").className).toBe("q-popover__content custom");
    expect(screen.getByRole("heading", { name: "Settings" }).className).toBe(
      "q-popover__title custom-title",
    );
    expect(screen.getByText("Details").className).toBe("q-popover__description custom-description");
  });

  it("forwards refs to the content, title, and description elements", () => {
    const contentRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    render(
      <Popover open>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content ref={contentRef}>
          <Popover.Title ref={titleRef}>Settings</Popover.Title>
          <Popover.Description ref={descriptionRef}>Details</Popover.Description>
        </Popover.Content>
      </Popover>,
    );

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    renderPopover({ showCloseButton: true, showArrow: true });

    await user.click(screen.getByRole("button", { name: "Filters" }));

    const results = await axe(document.body);
    expect(results.violations).toHaveLength(0);
  });
});
