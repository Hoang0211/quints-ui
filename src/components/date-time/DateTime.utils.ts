const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const monthFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

// "January 15, 2026" — the trigger's value and each day's accessible name.
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

// "January 2026" — the calendar's month heading and grid label.
export function formatMonth(date: Date): string {
  return monthFormatter.format(date);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

// Clamps the day to the target month's length — a bare setMonth() overflows (Jan 31 + 1 → Mar 3),
// which skips short months going forward and gets stuck on the same month going back.
export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(date.getDate(), lastDayOfMonth));
  return next;
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return a === b;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// A fixed 6×7 grid starting on the Sunday on or before the 1st, so every month
// fits and the popover height never jumps between months.
export function buildCalendarWeeks(viewDate: Date): Date[][] {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const weeks: Date[][] = [];
  for (let week = 0; week < 6; week++) {
    weeks.push(Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)));
  }
  return weeks;
}
