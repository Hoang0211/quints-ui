import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ChevronsLeftIcon } from "../../icons/ChevronsLeftIcon";
import { ChevronsRightIcon } from "../../icons/ChevronsRightIcon";
import { cx } from "../../utils/cx";
import { Select } from "../select/Select";
import {
  clampPage,
  getItemRange,
  getPageCount,
  getPageForFirstItem,
} from "./TablePagination.utils";
import "./TablePagination.css";

export type TablePaginationSize = "sm" | "md";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

export interface TablePaginationProps extends HTMLAttributes<HTMLElement> {
  /** Total number of rows across all pages. */
  totalItems: number;
  /** The current page, 1-based. Pair with `onPageChange` to control it. */
  page?: number;
  /** The starting page when `page` is not controlled. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Rows per page. Pair with `onPageSizeChange` to control it. */
  pageSize?: number;
  /** The starting page size when `pageSize` is not controlled. */
  defaultPageSize?: number;
  /** Called when the user picks a new page size. The page also moves (via `onPageChange`) so the first visible row stays on screen. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Choices in the rows-per-page selector. Pass an empty array to hide the selector. */
  pageSizeOptions?: number[];
  /** Show the first-page and last-page buttons. */
  showFirstLastButtons?: boolean;
  size?: TablePaginationSize;
}

interface PageButtonProps {
  label: string;
  unavailable: boolean;
  onActivate: () => void;
  children: ReactNode;
}

// aria-disabled rather than disabled: reaching the last page from "Next" would
// otherwise disable the focused button and drop keyboard focus to the page body.
function PageButton({ label, unavailable, onActivate, children }: PageButtonProps) {
  return (
    <button
      type="button"
      className="q-table-pagination__button"
      aria-label={label}
      aria-disabled={unavailable || undefined}
      onClick={() => {
        if (!unavailable) onActivate();
      }}
    >
      {children}
    </button>
  );
}

export const TablePagination = forwardRef<HTMLElement, TablePaginationProps>(
  (
    {
      totalItems,
      page: pageProp,
      defaultPage = 1,
      onPageChange,
      pageSize: pageSizeProp,
      defaultPageSize = 10,
      onPageSizeChange,
      pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
      showFirstLastButtons = true,
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    const pageSizeSelectId = useId();

    const isPageControlled = pageProp !== undefined;
    const [internalPage, setInternalPage] = useState(defaultPage);
    const isPageSizeControlled = pageSizeProp !== undefined;
    const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

    const pageSize = isPageSizeControlled ? pageSizeProp : internalPageSize;
    const pageCount = getPageCount(totalItems, pageSize);
    // The page can point past the end, e.g. after rows are deleted; show the last real page.
    const page = clampPage(isPageControlled ? pageProp : internalPage, pageCount);
    const { from, to } = getItemRange(page, pageSize, totalItems);
    const isFirstPage = page <= 1;
    const isLastPage = page >= pageCount;

    // Keep the current size selectable even if the consumer didn't list it.
    const sizeChoices = pageSizeOptions.includes(pageSize)
      ? pageSizeOptions
      : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

    const goToPage = (next: number) => {
      if (!isPageControlled) setInternalPage(next);
      onPageChange?.(next);
    };

    const handlePageSizeChange = (next: number) => {
      const nextPage = getPageForFirstItem(page, pageSize, next);
      if (!isPageSizeControlled) setInternalPageSize(next);
      onPageSizeChange?.(next);
      if (nextPage !== page) goToPage(nextPage);
    };

    const classes = cx("q-table-pagination", `q-table-pagination--${size}`, className);

    return (
      <nav ref={ref} aria-label="Pagination" className={classes} {...rest}>
        {pageSizeOptions.length > 0 && (
          <div className="q-table-pagination__page-size">
            <label className="q-table-pagination__page-size-label" htmlFor={pageSizeSelectId}>
              Rows per page
            </label>
            <Select
              id={pageSizeSelectId}
              size={size}
              value={String(pageSize)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              {sizeChoices.map((choice) => (
                <Select.Item key={choice} value={String(choice)}>
                  {choice}
                </Select.Item>
              ))}
            </Select>
          </div>
        )}
        <span className="q-table-pagination__range" aria-live="polite">
          {from}–{to} of {totalItems}
        </span>
        <div className="q-table-pagination__actions">
          {showFirstLastButtons && (
            <PageButton label="First page" unavailable={isFirstPage} onActivate={() => goToPage(1)}>
              <ChevronsLeftIcon />
            </PageButton>
          )}
          <PageButton
            label="Previous page"
            unavailable={isFirstPage}
            onActivate={() => goToPage(page - 1)}
          >
            <ChevronLeftIcon />
          </PageButton>
          <PageButton
            label="Next page"
            unavailable={isLastPage}
            onActivate={() => goToPage(page + 1)}
          >
            <ChevronRightIcon />
          </PageButton>
          {showFirstLastButtons && (
            <PageButton
              label="Last page"
              unavailable={isLastPage}
              onActivate={() => goToPage(pageCount)}
            >
              <ChevronsRightIcon />
            </PageButton>
          )}
        </div>
      </nav>
    );
  },
);

TablePagination.displayName = "TablePagination";
