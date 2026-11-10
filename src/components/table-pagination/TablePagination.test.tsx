import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TablePagination } from "./TablePagination";

// jsdom doesn't implement these, and the rows-per-page Select (Radix) relies on
// them for pointer capture, positioning, and scrolling the highlighted option.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

const button = (name: string) => screen.getByRole("button", { name });

describe("TablePagination", () => {
  it("renders a navigation landmark named Pagination", () => {
    render(<TablePagination totalItems={97} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("lets the consumer rename the landmark", () => {
    render(<TablePagination totalItems={97} aria-label="Orders pagination" />);
    expect(screen.getByRole("navigation", { name: "Orders pagination" })).toBeInTheDocument();
  });

  it("shows the visible range of rows", () => {
    render(<TablePagination totalItems={97} />);
    expect(screen.getByText("1–10 of 97")).toBeInTheDocument();
  });

  it("moves to the next page and reports it", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TablePagination totalItems={97} onPageChange={onPageChange} />);

    await user.click(button("Next page"));

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("11–20 of 97")).toBeInTheDocument();
  });

  it("jumps to the last and first page", async () => {
    const user = userEvent.setup();
    render(<TablePagination totalItems={97} />);

    await user.click(button("Last page"));
    expect(screen.getByText("91–97 of 97")).toBeInTheDocument();

    await user.click(button("First page"));
    expect(screen.getByText("1–10 of 97")).toBeInTheDocument();
  });

  it("marks first and previous unavailable on the first page and ignores them", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TablePagination totalItems={97} onPageChange={onPageChange} />);

    expect(button("First page")).toHaveAttribute("aria-disabled", "true");
    expect(button("Previous page")).toHaveAttribute("aria-disabled", "true");
    expect(button("Next page")).not.toHaveAttribute("aria-disabled");

    await user.click(button("Previous page"));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("marks next and last unavailable on the last page", () => {
    render(<TablePagination totalItems={97} defaultPage={10} />);

    expect(button("Next page")).toHaveAttribute("aria-disabled", "true");
    expect(button("Last page")).toHaveAttribute("aria-disabled", "true");
    expect(button("Previous page")).not.toHaveAttribute("aria-disabled");
  });

  it("pages forward from the keyboard", async () => {
    const user = userEvent.setup();
    render(<TablePagination totalItems={97} />);

    // Tab order: rows-per-page selector, First, Previous, Next.
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(button("Next page")).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByText("11–20 of 97")).toBeInTheDocument();
  });

  it("keeps focus on Next when reaching the last page, and ignores further presses", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TablePagination totalItems={97} defaultPage={9} onPageChange={onPageChange} />);

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByText("91–97 of 97")).toBeInTheDocument();
    expect(button("Next page")).toHaveFocus();
    expect(button("Next page")).toHaveAttribute("aria-disabled", "true");

    await user.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("follows a controlled page and only reports clicks", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <TablePagination totalItems={97} page={3} onPageChange={onPageChange} />,
    );
    expect(screen.getByText("21–30 of 97")).toBeInTheDocument();

    await user.click(button("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(screen.getByText("21–30 of 97")).toBeInTheDocument();

    rerender(<TablePagination totalItems={97} page={4} onPageChange={onPageChange} />);
    expect(screen.getByText("31–40 of 97")).toBeInTheDocument();
  });

  it("changes the page size from the keyboard", async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(<TablePagination totalItems={97} onPageSizeChange={onPageSizeChange} />);

    await user.tab();
    expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "10" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(screen.getByText("1–25 of 97")).toBeInTheDocument();
  });

  it("keeps the first visible row on screen when the page size changes", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<TablePagination totalItems={97} defaultPage={5} onPageChange={onPageChange} />);
    expect(screen.getByText("41–50 of 97")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Rows per page" }));
    await user.click(screen.getByRole("option", { name: "25" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("26–50 of 97")).toBeInTheDocument();
  });

  it("keeps a page size that isn't among the options selectable", () => {
    render(<TablePagination totalItems={97} defaultPageSize={20} />);
    expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveTextContent("20");
    expect(screen.getByText("1–20 of 97")).toBeInTheDocument();
  });

  it("hides the rows-per-page selector when given no options", () => {
    render(<TablePagination totalItems={97} pageSizeOptions={[]} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("hides the first and last buttons when showFirstLastButtons is false", () => {
    render(<TablePagination totalItems={97} showFirstLastButtons={false} />);
    expect(screen.queryByRole("button", { name: "First page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Last page" })).not.toBeInTheDocument();
    expect(button("Next page")).toBeInTheDocument();
  });

  it("shows an empty range and no available pages for an empty table", () => {
    render(<TablePagination totalItems={0} />);

    expect(screen.getByText("0–0 of 0")).toBeInTheDocument();
    for (const name of ["First page", "Previous page", "Next page", "Last page"]) {
      expect(button(name)).toHaveAttribute("aria-disabled", "true");
    }
  });

  it("shows the last real page when the controlled page is past the end", () => {
    render(<TablePagination totalItems={97} page={20} />);
    expect(screen.getByText("91–97 of 97")).toBeInTheDocument();
  });

  it("defaults to md size and applies the given size", () => {
    const { rerender } = render(<TablePagination totalItems={97} />);
    expect(screen.getByRole("navigation")).toHaveClass("q-table-pagination--md");

    rerender(<TablePagination totalItems={97} size="sm" />);
    expect(screen.getByRole("navigation")).toHaveClass("q-table-pagination--sm");
  });

  it("merges a consumer className after the generated classes", () => {
    render(<TablePagination totalItems={97} className="custom" />);
    expect(screen.getByRole("navigation").className).toBe(
      "q-table-pagination q-table-pagination--md custom",
    );
  });

  it("forwards the ref to the nav element", () => {
    const ref = createRef<HTMLElement>();
    render(<TablePagination ref={ref} totalItems={97} />);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TablePagination totalItems={97} defaultPage={3} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
