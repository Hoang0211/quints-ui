import { describe, expect, it } from "vitest";
import { addDays, addMonths, buildCalendarWeeks, isSameDay, startOfDay } from "./DateTime.utils";

describe("startOfDay", () => {
  it("drops the time of day", () => {
    expect(startOfDay(new Date(2026, 4, 15, 13, 45, 30))).toEqual(new Date(2026, 4, 15));
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 1));
    expect(addDays(new Date(2026, 0, 1), -1)).toEqual(new Date(2025, 11, 31));
  });

  it("does not mutate its input", () => {
    const date = new Date(2026, 4, 15);
    addDays(date, 3);
    expect(date).toEqual(new Date(2026, 4, 15));
  });
});

describe("addMonths", () => {
  it("keeps the day of month when the target month is long enough", () => {
    expect(addMonths(new Date(2026, 4, 15), 1)).toEqual(new Date(2026, 5, 15));
  });

  it("clamps to the last day of a shorter target month instead of overflowing", () => {
    expect(addMonths(new Date(2025, 0, 31), 1)).toEqual(new Date(2025, 1, 28));
    expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29));
    expect(addMonths(new Date(2026, 2, 31), -1)).toEqual(new Date(2026, 1, 28));
  });

  it("crosses year boundaries", () => {
    expect(addMonths(new Date(2026, 11, 15), 1)).toEqual(new Date(2027, 0, 15));
    expect(addMonths(new Date(2026, 0, 15), -1)).toEqual(new Date(2025, 11, 15));
  });
});

describe("isSameDay", () => {
  it("ignores the time of day", () => {
    expect(isSameDay(new Date(2026, 4, 15, 1), new Date(2026, 4, 15, 23))).toBe(true);
  });

  it("distinguishes different days", () => {
    expect(isSameDay(new Date(2026, 4, 15), new Date(2026, 4, 16))).toBe(false);
  });

  it("treats two nulls as equal and null versus a date as different", () => {
    expect(isSameDay(null, null)).toBe(true);
    expect(isSameDay(null, new Date(2026, 4, 15))).toBe(false);
  });
});

describe("buildCalendarWeeks", () => {
  it("returns six weeks of seven consecutive days, each starting on a Sunday", () => {
    const weeks = buildCalendarWeeks(new Date(2026, 9, 20));
    expect(weeks).toHaveLength(6);
    weeks.forEach((week) => {
      expect(week).toHaveLength(7);
      expect(week[0].getDay()).toBe(0);
    });

    const days = weeks.flat();
    days.slice(1).forEach((day, index) => {
      expect(day).toEqual(addDays(days[index], 1));
    });
  });

  it("starts on the Sunday on or before the 1st", () => {
    // October 1, 2026 is a Thursday.
    expect(buildCalendarWeeks(new Date(2026, 9, 20))[0][0]).toEqual(new Date(2026, 8, 27));
    // February 1, 2026 is a Sunday.
    expect(buildCalendarWeeks(new Date(2026, 1, 10))[0][0]).toEqual(new Date(2026, 1, 1));
  });
});
