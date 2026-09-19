import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import "./Checkbox.css";

export type CheckboxSize = "sm" | "md";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: ReactNode;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  size?: CheckboxSize;
}

export const Checkbox = forwardRef<ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      size = "md",
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const helperId = `${checkboxId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = [
      "q-checkbox",
      `q-checkbox--${size}`,
      error && "q-checkbox--error",
      disabled && "q-checkbox--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-checkbox__helper", error && "q-checkbox__helper--error"]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <div className="q-checkbox__row">
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperContent ? helperId : undefined}
            className="q-checkbox__control"
            {...rest}
          >
            <CheckboxPrimitive.Indicator className="q-checkbox__indicator">
              <svg
                className="q-checkbox__icon-check"
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 6.5l2.5 2.5 4.5-5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="q-checkbox__icon-dash"
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
              >
                <line
                  x1="2.5"
                  y1="6"
                  x2="9.5"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          {label && (
            <label className="q-checkbox__label" htmlFor={checkboxId}>
              {label}
            </label>
          )}
        </div>
        {helperContent && (
          <div id={helperId} className={helperClasses}>
            {helperContent}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
