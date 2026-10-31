import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { addDays, addMonths, startOfDay } from "./DateTime.utils";

const DAY_DELTAS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

interface CalendarNavigationOptions {
  selectedDate: Date | null;
  /** The focused day only takes DOM focus while the calendar is open. */
  open: boolean;
  onSelect: (day: Date) => void;
}

// The visible month, the roving-focus day, and the grid's keyboard navigation.
export function useCalendarNavigation({ selectedDate, open, onSelect }: CalendarNavigationOptions) {
  const [viewDate, setViewDate] = useState<Date>(() => startOfDay(selectedDate ?? new Date()));
  const [focusedDate, setFocusedDate] = useState<Date>(() =>
    startOfDay(selectedDate ?? new Date()),
  );
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (!open) return;
    dayRefs.current.get(focusedDate.toDateString())?.focus();
  }, [focusedDate, open]);

  // The effect above can't focus the day on open: Radix's portal mounts the day
  // buttons a render later. Call this from Popover.Content's onOpenAutoFocus instead.
  const focusCurrentDay = () => {
    dayRefs.current.get(focusedDate.toDateString())?.focus();
  };

  // Re-anchors the view and focus on the selected date (or today), e.g. when the calendar opens.
  const resetView = () => {
    const anchor = startOfDay(selectedDate ?? new Date());
    setViewDate(anchor);
    setFocusedDate(anchor);
  };

  const showPreviousMonth = () => setViewDate((prev) => addMonths(prev, -1));
  const showNextMonth = () => setViewDate((prev) => addMonths(prev, 1));

  const dayRef = (day: Date) => (el: HTMLButtonElement | null) => {
    if (el) dayRefs.current.set(day.toDateString(), el);
    else dayRefs.current.delete(day.toDateString());
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key in DAY_DELTAS) {
      event.preventDefault();
      const next = addDays(focusedDate, DAY_DELTAS[event.key]);
      if (
        next.getMonth() !== viewDate.getMonth() ||
        next.getFullYear() !== viewDate.getFullYear()
      ) {
        setViewDate(next);
      }
      setFocusedDate(next);
    } else if (event.key === "PageUp") {
      event.preventDefault();
      setViewDate((prev) => addMonths(prev, -1));
      setFocusedDate((prev) => addMonths(prev, -1));
    } else if (event.key === "PageDown") {
      event.preventDefault();
      setViewDate((prev) => addMonths(prev, 1));
      setFocusedDate((prev) => addMonths(prev, 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedDate((prev) => addDays(prev, -prev.getDay()));
    } else if (event.key === "End") {
      event.preventDefault();
      setFocusedDate((prev) => addDays(prev, 6 - prev.getDay()));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(focusedDate);
    }
  };

  return {
    viewDate,
    focusedDate,
    setFocusedDate,
    focusCurrentDay,
    resetView,
    showPreviousMonth,
    showNextMonth,
    dayRef,
    handleGridKeyDown,
  };
}
