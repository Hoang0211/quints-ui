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
  onSelect: (day: Date) => void;
}

// The visible month, the roving-focus day, and the grid's keyboard navigation.
// Starts on the selected date (or today) and moves DOM focus to the focused day,
// including on mount, so the calling component should only mount while visible.
export function useCalendarNavigation({ selectedDate, onSelect }: CalendarNavigationOptions) {
  const [viewDate, setViewDate] = useState<Date>(() => startOfDay(selectedDate ?? new Date()));
  const [focusedDate, setFocusedDate] = useState<Date>(() =>
    startOfDay(selectedDate ?? new Date()),
  );
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    dayRefs.current.get(focusedDate.toDateString())?.focus();
  }, [focusedDate]);

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
    showPreviousMonth,
    showNextMonth,
    dayRef,
    handleGridKeyDown,
  };
}
