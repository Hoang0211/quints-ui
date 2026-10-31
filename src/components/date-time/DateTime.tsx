import { forwardRef, useId, useState, type ButtonHTMLAttributes } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { cx } from "../../utils/cx";
import { Calendar } from "./Calendar";
import { formatDate, startOfDay } from "./DateTime.utils";
import "./DateTime.css";

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

    const wrapperClasses = cx(
      "q-date-time",
      error && "q-date-time--error",
      fullWidth && "q-date-time--full-width",
      disabled && "q-date-time--disabled",
      className,
    );

    const helperContent = error && errorMessage ? errorMessage : helperText;
    const helperClasses = cx("q-date-time__helper", error && "q-date-time__helper--error");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-date-time__label" htmlFor={triggerId}>
            {label}
          </label>
        )}
        <Popover.Root open={open} onOpenChange={setOpen}>
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
                {selectedDate ? formatDate(selectedDate) : placeholder}
              </span>
              <CalendarIcon className="q-date-time__icon" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="q-date-time__content"
              sideOffset={4}
              align="start"
              // Radix would focus the first button ("Previous month"); per the WAI-ARIA
              // date picker pattern, Calendar focuses the selected day (or today) itself.
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <Calendar selectedDate={selectedDate ?? null} onSelect={handleSelect} />
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
