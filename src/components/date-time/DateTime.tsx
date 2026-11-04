import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useField } from "../../hooks/useField";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
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
    const field = useField({ id, helperText, error, errorMessage });

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

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-date-time__label" htmlFor={field.controlId}>
            {label}
          </label>
        )}
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              {...field.controlProps}
              type="button"
              className="q-date-time__trigger"
              disabled={disabled}
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
        <FieldHelper block="q-date-time" {...field.helperProps} />
      </div>
    );
  },
);

DateTime.displayName = "DateTime";
