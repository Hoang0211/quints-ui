import { describe, expect, it } from "vitest";
import {
  clampPage,
  getItemRange,
  getPageCount,
  getPageForFirstItem,
} from "./TablePagination.utils";

describe("getPageCount", () => {
  it("rounds a partial last page up", () => {
    expect(getPageCount(97, 10)).toBe(10);
    expect(getPageCount(100, 10)).toBe(10);
  });

  it("returns 1 for an empty table", () => {
    expect(getPageCount(0, 10)).toBe(1);
  });
});

describe("clampPage", () => {
  it("keeps a page within 1 and the page count", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(9, 5)).toBe(5);
  });
});

describe("getItemRange", () => {
  it("returns the 1-based first and last item on a page", () => {
    expect(getItemRange(1, 10, 97)).toEqual({ from: 1, to: 10 });
    expect(getItemRange(2, 10, 97)).toEqual({ from: 11, to: 20 });
  });

  it("stops at the total on a partial last page", () => {
    expect(getItemRange(10, 10, 97)).toEqual({ from: 91, to: 97 });
  });

  it("returns 0–0 for an empty table", () => {
    expect(getItemRange(1, 10, 0)).toEqual({ from: 0, to: 0 });
  });
});

describe("getPageForFirstItem", () => {
  it("keeps the first visible item on screen when the page size grows", () => {
    // Page 5 of 10 starts at item 41, which is on page 2 of 25 (26–50).
    expect(getPageForFirstItem(5, 10, 25)).toBe(2);
  });

  it("keeps the first visible item on screen when the page size shrinks", () => {
    // Page 2 of 25 starts at item 26, which is on page 3 of 10 (21–30).
    expect(getPageForFirstItem(2, 25, 10)).toBe(3);
  });

  it("stays on page 1 from page 1", () => {
    expect(getPageForFirstItem(1, 10, 50)).toBe(1);
  });
});
