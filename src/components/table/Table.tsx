import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { SortIcon } from "../../icons/SortIcon";
import { cx } from "../../utils/cx";
import "./Table.css";

export type TableVariant = "plain" | "striped" | "bordered";
export type TableSize = "sm" | "md" | "lg";
export type TableSortDirection = "asc" | "desc" | "none";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
  size?: TableSize;
  /** Highlight body rows on hover. */
  hoverable?: boolean;
  /** Pin the header row while the table scrolls vertically. Pair with `maxHeight`. */
  stickyHeader?: boolean;
  /** Max height of the scroll wrapper; content beyond it scrolls vertically. */
  maxHeight?: CSSProperties["maxHeight"];
}

// A height-capped wrapper becomes a scrollable region, which must be keyboard
// focusable and is best named. Caption registers its id here so the wrapper
// only points aria-labelledby at a caption that actually exists.
interface TableCaptionContextValue {
  defaultCaptionId: string;
  setCaptionId: (id: string | null) => void;
}

const TableCaptionContext = createContext<TableCaptionContextValue | null>(null);

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      variant = "plain",
      size = "md",
      hoverable = false,
      stickyHeader = false,
      maxHeight,
      className,
      ...rest
    },
    ref,
  ) => {
    const defaultCaptionId = useId();
    const [captionId, setCaptionId] = useState<string | null>(null);
    const captionContext = useMemo(() => ({ defaultCaptionId, setCaptionId }), [defaultCaptionId]);
    const scrollable = maxHeight !== undefined;

    const classes = cx(
      "q-table",
      `q-table--${variant}`,
      `q-table--${size}`,
      hoverable && "q-table--hoverable",
      stickyHeader && "q-table--sticky-header",
      className,
    );

    // The wrapper is the scroll container, so wide tables scroll horizontally
    // instead of overflowing the page, and sticky headers stick within it.
    return (
      <div
        className="q-table__wrapper"
        style={scrollable ? { maxHeight } : undefined}
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable && captionId ? "region" : undefined}
        aria-labelledby={scrollable && captionId ? captionId : undefined}
      >
        <TableCaptionContext.Provider value={captionContext}>
          <table ref={ref} className={classes} {...rest} />
        </TableCaptionContext.Provider>
      </div>
    );
  },
);
TableRoot.displayName = "Table";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ id: idProp, className, ...rest }, ref) => {
    const captionContext = useContext(TableCaptionContext);
    const setCaptionId = captionContext?.setCaptionId;
    const id = idProp ?? captionContext?.defaultCaptionId;

    useEffect(() => {
      if (!setCaptionId || !id) return;
      setCaptionId(id);
      return () => setCaptionId(null);
    }, [setCaptionId, id]);

    const classes = cx("q-table__caption", className);
    return <caption ref={ref} id={id} className={classes} {...rest} />;
  },
);
TableCaption.displayName = "Table.Caption";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-table__header", className);
    return <thead ref={ref} className={classes} {...rest} />;
  },
);
TableHeader.displayName = "Table.Header";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-table__body", className);
    return <tbody ref={ref} className={classes} {...rest} />;
  },
);
TableBody.displayName = "Table.Body";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-table__footer", className);
    return <tfoot ref={ref} className={classes} {...rest} />;
  },
);
TableFooter.displayName = "Table.Footer";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...rest }, ref) => {
  const classes = cx("q-table__row", className);
  return <tr ref={ref} className={classes} {...rest} />;
});
TableRow.displayName = "Table.Row";

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Current sort state of this column. Only applies when `onSort` is set. */
  sortDirection?: TableSortDirection;
  /** Makes the column sortable: renders the header as a button that calls this on activation. */
  onSort?: () => void;
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortDirection = "none", onSort, scope = "col", className, children, ...rest }, ref) => {
    const sortable = onSort !== undefined;
    const classes = cx("q-table__head", sortable && "q-table__head--sortable", className);

    // Per the WAI-ARIA sortable table pattern, aria-sort is only set on the
    // column that is actually sorted.
    const ariaSort = sortable && sortDirection !== "none" ? ARIA_SORT[sortDirection] : undefined;

    return (
      <th ref={ref} scope={scope} className={classes} aria-sort={ariaSort} {...rest}>
        {sortable ? (
          <button type="button" className="q-table__sort-button" onClick={onSort}>
            {children}
            <SortIcon direction={sortDirection} className="q-table__sort-icon" />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = "Table.Head";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-table__cell", className);
    return <td ref={ref} className={classes} {...rest} />;
  },
);
TableCell.displayName = "Table.Cell";

export const Table = Object.assign(TableRoot, {
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});
