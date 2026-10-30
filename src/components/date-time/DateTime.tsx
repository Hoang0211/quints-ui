import { forwardRef, useId, useState, type ButtonHTMLAttributes } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { cx } from "../../utils/cx";
import { useCalendarNavigation } from "./useCalendarNavigation";
import { buildCalendarWeeks, isSameDay, startOfDay } from "./DateTime.utils";
import "./DateTime.css";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const monthFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

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

    const handleSelect = (day: Date) => {
      const next = startOfDay(day);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      setOpen(false);
    };

    const {
      viewDate,
      focusedDate,
      setFocusedDate,
      resetView,
      showPreviousMonth,
      showNextMonth,
      dayRef,
      handleGridKeyDown,
    } = useCalendarNavigation({ selectedDate: selectedDate ?? null, open, onSelect: handleSelect });

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) resetView();
      setOpen(nextOpen);
    };

    const wrapperClasses = cx(
      "q-date-time",
      error && "q-date-time--error",
      fullWidth && "q-date-time--full-width",
      disabled && "q-date-time--disabled",
      className,
    );

    const helperContent = error && errorMessage ? errorMessage : helperText;
    const helperClasses = cx("q-date-time__helper", error && "q-date-time__helper--error");

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
              <CalendarIcon className="q-date-time__icon" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="q-date-time__content" sideOffset={4} align="start">
              <div className="q-date-time__header">
                <button
                  type="button"
                  className="q-date-time__nav"
                  aria-label="Previous month"
                  onClick={showPreviousMonth}
                >
                  <ChevronLeftIcon />
                </button>
                <span className="q-date-time__month-label">{monthFormatter.format(viewDate)}</span>
                <button
                  type="button"
                  className="q-date-time__nav"
                  aria-label="Next month"
                  onClick={showNextMonth}
                >
                  <ChevronRightIcon />
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
                      const dayClasses = cx(
                        "q-date-time__day",
                        day.getMonth() !== viewDate.getMonth() && "q-date-time__day--outside",
                        isSameDay(day, selectedDate ?? null) && "q-date-time__day--selected",
                        isSameDay(day, today) && "q-date-time__day--today",
                      );

                      return (
                        <button
                          key={day.toDateString()}
                          ref={dayRef(day)}
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
