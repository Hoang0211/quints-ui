import { createRef, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { Table, type TableProps } from "./Table";

function renderTable(props: TableProps = {}, header?: ReactNode) {
  return render(
    <Table {...props}>
      <Table.Caption>Team members</Table.Caption>
      <Table.Header>
        <Table.Row>
          {header ?? (
            <>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
            </>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Ada Lovelace</Table.Cell>
          <Table.Cell>Engineer</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Grace Hopper</Table.Cell>
          <Table.Cell>Admiral</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>2 members</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>,
  );
}

describe("Table", () => {
  it("renders a table named by its caption with header and body cells", () => {
    renderTable();

    expect(screen.getByRole("table", { name: "Team members" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Ada Lovelace" })).toBeInTheDocument();
    // header row + 2 body rows + footer row
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("defaults to the plain variant and md size", () => {
    renderTable();
    const table = screen.getByRole("table");
    expect(table.className).toContain("q-table--plain");
    expect(table.className).toContain("q-table--md");
    expect(table.className).not.toContain("q-table--hoverable");
    expect(table.className).not.toContain("q-table--sticky-header");
  });

  it("applies the given variant and size classes", () => {
    renderTable({ variant: "striped", size: "sm" });
    const table = screen.getByRole("table");
    expect(table.className).toContain("q-table--striped");
    expect(table.className).toContain("q-table--sm");
  });

  it("applies the hoverable and stickyHeader classes", () => {
    renderTable({ hoverable: true, stickyHeader: true });
    const table = screen.getByRole("table");
    expect(table.className).toContain("q-table--hoverable");
    expect(table.className).toContain("q-table--sticky-header");
  });

  it("wraps the table in a scroll container that receives maxHeight", () => {
    renderTable({ maxHeight: 240 });
    const wrapper = screen.getByRole("table").parentElement;

    expect(wrapper).toHaveClass("q-table__wrapper");
    expect(wrapper).toHaveStyle({ maxHeight: "240px" });
  });

  it("leaves the wrapper out of the tab order when not height-capped", () => {
    renderTable();
    const wrapper = screen.getByRole("table").parentElement;

    expect(wrapper).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("makes a height-capped wrapper a focusable region named by the caption", async () => {
    const user = userEvent.setup();
    renderTable({ maxHeight: 240 });
    const region = screen.getByRole("region", { name: "Team members" });

    expect(region).toBe(screen.getByRole("table").parentElement);
    await user.tab();
    expect(region).toHaveFocus();
  });

  it("keeps a consumer-provided caption id as the region's label", () => {
    render(
      <Table maxHeight={240}>
        <Table.Caption id="custom-caption">Team members</Table.Caption>
      </Table>,
    );

    expect(screen.getByRole("region", { name: "Team members" })).toHaveAttribute(
      "aria-labelledby",
      "custom-caption",
    );
  });

  it("keeps a height-capped wrapper focusable but unnamed without a caption", () => {
    render(
      <Table maxHeight={240}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const wrapper = screen.getByRole("table").parentElement;

    expect(wrapper).toHaveAttribute("tabindex", "0");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("merges consumer classNames after the generated ones", () => {
    render(
      <Table className="custom-table">
        <Table.Body>
          <Table.Row className="custom-row">
            <Table.Cell className="custom-cell">Cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole("table")).toHaveClass("q-table", "custom-table");
    expect(screen.getByRole("row")).toHaveClass("q-table__row", "custom-row");
    expect(screen.getByRole("cell")).toHaveClass("q-table__cell", "custom-cell");
  });

  it("defaults header cells to column scope", () => {
    renderTable();
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("scope", "col");
  });

  it("renders non-sortable headers as plain text without aria-sort", () => {
    renderTable();
    const header = screen.getByRole("columnheader", { name: "Name" });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(header).not.toHaveAttribute("aria-sort");
  });

  it("renders a sortable header as a button that calls onSort when clicked", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    renderTable({}, <Table.Head onSort={onSort}>Name</Table.Head>);

    await user.click(screen.getByRole("button", { name: "Name" }));

    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("calls onSort from the keyboard", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    renderTable({}, <Table.Head onSort={onSort}>Name</Table.Head>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Name" })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["asc", "ascending"],
    ["desc", "descending"],
  ] as const)("sets aria-sort for sortDirection=%s", (sortDirection, ariaSort) => {
    renderTable(
      {},
      <Table.Head sortDirection={sortDirection} onSort={() => {}}>
        Name
      </Table.Head>,
    );

    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      ariaSort,
    );
  });

  it("omits aria-sort on a sortable but unsorted header", () => {
    renderTable({}, <Table.Head onSort={() => {}}>Name</Table.Head>);
    expect(screen.getByRole("columnheader", { name: "Name" })).not.toHaveAttribute("aria-sort");
  });

  it("forwards refs to the underlying table elements", () => {
    const tableRef = createRef<HTMLTableElement>();
    const rowRef = createRef<HTMLTableRowElement>();
    const headRef = createRef<HTMLTableCellElement>();
    const cellRef = createRef<HTMLTableCellElement>();
    render(
      <Table ref={tableRef}>
        <Table.Header>
          <Table.Row>
            <Table.Head ref={headRef}>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row ref={rowRef}>
            <Table.Cell ref={cellRef}>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
    expect(headRef.current?.tagName).toBe("TH");
    expect(cellRef.current?.tagName).toBe("TD");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTable(
      { variant: "bordered" },
      <>
        <Table.Head sortDirection="asc" onSort={() => {}}>
          Name
        </Table.Head>
        <Table.Head onSort={() => {}}>Role</Table.Head>
      </>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("has no accessibility violations as a height-capped sticky-header region", async () => {
    const { container } = renderTable({ stickyHeader: true, maxHeight: 240 });
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
