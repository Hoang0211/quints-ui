// Always at least 1, so an empty table still has a (single, empty) page to show.
export function getPageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(page, 1), pageCount);
}

// The 1-based item numbers shown on a page, e.g. page 2 of 10-item pages → 11–20.
export function getItemRange(
  page: number,
  pageSize: number,
  totalItems: number,
): { from: number; to: number } {
  if (totalItems === 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  return { from, to: Math.min(page * pageSize, totalItems) };
}

// After the page size changes, the page that still contains the first item the
// user was looking at — so they don't get thrown back to page 1.
export function getPageForFirstItem(page: number, oldPageSize: number, newPageSize: number) {
  const firstItemIndex = (page - 1) * oldPageSize;
  return Math.floor(firstItemIndex / newPageSize) + 1;
}
