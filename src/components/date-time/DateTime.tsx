import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from "react";
import * as Popover from "@radix-ui/react-popover";
import "./DateTime.css";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const monthFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return a === b;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarWeeks(viewDate: Date): Date[][] {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const weeks: Date[][] = [];
  for (let week = 0; week < 6; week++) {
    weeks.push(Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)));
  }
  return weeks;
}

export interface DateTimeProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "type"
> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const DateTime = forwardRef<HTMLButtonElement, DateTimeProps>(
  (
    {
      value,
      defaultValue = null,
      onChange,
      label,
      helperText,
      error = false,
      errorMessage,
      placeholder = "Select date",
      fullWidth = false,
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const helperId = `${triggerId}-helper`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
    const selectedDate = isControlled ? value : internalValue;

    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(() => startOfDay(selectedDate ?? new Date()));
    const [focusedDate, setFocusedDate] = useState<Date>(() =>
      startOfDay(selectedDate ?? new Date()),
    );
    const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    useEffect(() => {
      if (!open) return;
      dayRefs.current.get(focusedDate.toDateString())?.focus();
    }, [focusedDate, open]);

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        const anchor = startOfDay(selectedDate ?? new Date());
        setViewDate(anchor);
        setFocusedDate(anchor);
      }
      setOpen(nextOpen);
    };

    const handleSelect = (day: Date) => {
      const next = startOfDay(day);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      setOpen(false);
    };

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const dayDeltas: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
      };

      if (event.key in dayDeltas) {
        event.preventDefault();
        const next = addDays(focusedDate, dayDeltas[event.key]);
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
        handleSelect(focusedDate);
      }
    };

    const wrapperClasses = [
      "q-date-time",
      error && "q-date-time--error",
      fullWidth && "q-date-time--full-width",
      disabled && "q-date-time--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const helperContent = error && errorMessage ? errorMessage : helperText;
    const helperClasses = ["q-date-time__helper", error && "q-date-time__helper--error"]
      .filter(Boolean)
      .join(" ");

    const today = startOfDay(new Date());
    const weeks = buildCalendarWeeks(viewDate);

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-date-time__label" htmlFor={triggerId}>
            {label}
          </label>
        )}
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              id={triggerId}
              type="button"
              className="q-date-time__trigger"
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={helperContent ? helperId : undefined}
              {...rest}
            >
              <span className="q-date-time__value">
                {selectedDate ? dateFormatter.format(selectedDate) : placeholder}
              </span>
              <svg
                className="q-date-time__icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="1.5"
                  y="2.5"
                  width="13"
                  height="12"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <line x1="1.5" y1="6" x2="14.5" y2="6" stroke="currentColor" strokeWidth="1.3" />
                <line
                  x1="4.5"
                  y1="1"
                  x2="4.5"
                  y2="3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <line
                  x1="11.5"
                  y1="1"
                  x2="11.5"
                  y2="3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="q-date-time__content" sideOffset={4} align="start">
              <div className="q-date-time__header">
                <button
                  type="button"
                  className="q-date-time__nav"
                  aria-label="Previous month"
                  onClick={() => setViewDate((prev) => addMonths(prev, -1))}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path
                      d="M10 3l-5 5 5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span className="q-date-time__month-label">{monthFormatter.format(viewDate)}</span>
                <button
                  type="button"
                  className="q-date-time__nav"
                  aria-label="Next month"
                  onClick={() => setViewDate((prev) => addMonths(prev, 1))}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path
                      d="M6 3l5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="q-date-time__grid"
                role="grid"
                aria-label={monthFormatter.format(viewDate)}
                onKeyDown={handleGridKeyDown}
              >
                <div className="q-date-time__weekdays" role="row">
                  {WEEKDAY_LABELS.map((weekday) => (
                    <span key={weekday} className="q-date-time__weekday" role="columnheader">
                      {weekday}
                    </span>
                  ))}
                </div>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="q-date-time__week" role="row">
                    {week.map((day) => {
                      const dayClasses = [
                        "q-date-time__day",
                        day.getMonth() !== viewDate.getMonth() && "q-date-time__day--outside",
                        isSameDay(day, selectedDate ?? null) && "q-date-time__day--selected",
                        isSameDay(day, today) && "q-date-time__day--today",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          key={day.toDateString()}
                          ref={(el) => {
                            if (el) dayRefs.current.set(day.toDateString(), el);
                            else dayRefs.current.delete(day.toDateString());
                          }}
                          type="button"
                          role="gridcell"
                          className={dayClasses}
                          tabIndex={isSameDay(day, focusedDate) ? 0 : -1}
                          aria-selected={isSameDay(day, selectedDate ?? null)}
                          aria-current={isSameDay(day, today) ? "date" : undefined}
                          aria-label={dateFormatter.format(day)}
                          onClick={() => handleSelect(day)}
                          onFocus={() => setFocusedDate(day)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {helperContent && (
          <div id={helperId} className={helperClasses}>
            {helperContent}
          </div>
        )}
      </div>
    );
  },
);

DateTime.displayName = "DateTime";
