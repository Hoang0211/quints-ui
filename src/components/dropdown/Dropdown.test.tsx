import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownContentProps } from "./Dropdown";

// jsdom doesn't implement ResizeObserver, which Radix DropdownMenu's
// positioning relies on.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

function renderDropdown(
  contentProps: DropdownContentProps = {},
  { onSelect = vi.fn() }: { onSelect?: () => void } = {},
) {
  return render(
    <Dropdown>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Content {...contentProps}>
        <Dropdown.Label>Actions</Dropdown.Label>
        <Dropdown.Item onSelect={onSelect}>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item disabled>Archive</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>,
  );
}

describe("Dropdown", () => {
  it("renders a closed trigger button", () => {
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole("button", { name: "Options" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("opens the menu with the keyboard and focuses the first item", async () => {
    const user = userEvent.setup();
    renderDropdown();

    screen.getByRole("button", { name: "Options" }).focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("calls onSelect and closes the menu when an item is selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown({}, { onSelect });

    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("marks disabled items and does not select them", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled onSelect={onSelect}>
            Archive
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByRole("button", { name: "Options" }));
    const item = screen.getByRole("menuitem", { name: "Archive" });
    expect(item).toHaveAttribute("aria-disabled", "true");

    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders an item's icon and shortcut hidden from assistive tech", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item icon={<svg data-testid="icon" />} shortcut="⌘E">
            Edit
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByRole("button", { name: "Options" }));

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("⌘E")).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults the content to md size, bottom side, and start alignment", () => {
    render(
      <Dropdown open>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );
    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("q-dropdown__content--md");
    expect(menu).toHaveAttribute("data-side", "bottom");
    expect(menu).toHaveAttribute("data-align", "start");
  });

  it("applies the given size, side, and align", () => {
    render(
      <Dropdown open>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content size="sm" side="top" align="end">
          <Dropdown.Item>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );
    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("q-dropdown__content--sm");
    expect(menu).toHaveAttribute("data-side", "top");
    expect(menu).toHaveAttribute("data-align", "end");
  });

  it("merges a consumer className after the generated classes", () => {
    render(
      <Dropdown open>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content className="custom">
          <Dropdown.Item className="custom-item">Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );
    expect(screen.getByRole("menu").className).toBe(
      "q-dropdown__content q-dropdown__content--md custom",
    );
    expect(screen.getByRole("menuitem", { name: "Edit" }).className).toBe(
      "q-dropdown__item custom-item",
    );
  });

  it("forwards refs to the content and item elements", () => {
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <Dropdown open>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content ref={contentRef}>
          <Dropdown.Item ref={itemRef}>Edit</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole("button", { name: "Options" }));

    // The menu is portaled outside the render container, so scan the whole
    // body. `region` is a page-level rule (content outside landmarks) that
    // flags the bare test harness, not the component — unlike Dialog, a
    // `role="menu"` isn't treated as a landmark.
    const results = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(results.violations).toHaveLength(0);
  });
});
