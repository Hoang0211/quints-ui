import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

function renderTabs(props: Partial<ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="account" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account settings</Tabs.Content>
      <Tabs.Content value="password">Password settings</Tabs.Content>
      <Tabs.Content value="billing">Billing settings</Tabs.Content>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("renders a tablist with the given tabs", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Password" })).toBeInTheDocument();
  });

  it("shows the panel matching the defaultValue and marks its tab active", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Account" })).toHaveTextContent("Account settings");
  });

  it("switches panels when a different tab is clicked", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Password" }));

    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Password" })).toHaveTextContent(
      "Password settings",
    );
  });

  it("calls onValueChange when the active tab changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });

    await user.click(screen.getByRole("tab", { name: "Password" }));

    expect(onValueChange).toHaveBeenCalledWith("password");
  });

  it("moves focus between tabs with arrow keys", async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByRole("tab", { name: "Account" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Password" })).toHaveFocus();
  });

  it("skips a disabled tab", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Billing" })).toBeDisabled();
  });

  it("applies the md size by default", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A content</Tabs.Content>
      </Tabs>,
    );
    expect(screen.getByRole("tablist").className).toContain("q-tabs__list--md");
  });

  it("applies the given size class", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List size="sm">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A content</Tabs.Content>
      </Tabs>,
    );
    expect(screen.getByRole("tablist").className).toContain("q-tabs__list--sm");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTabs();
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
