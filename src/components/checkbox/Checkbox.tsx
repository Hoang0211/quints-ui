import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "../../icons/CheckIcon";
import { DashIcon } from "../../icons/DashIcon";
import { cx } from "../../utils/cx";
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

    const wrapperClasses = cx(
      "q-checkbox",
      `q-checkbox--${size}`,
      error && "q-checkbox--error",
      disabled && "q-checkbox--disabled",
      className,
    );

    const helperClasses = cx("q-checkbox__helper", error && "q-checkbox__helper--error");

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
              <CheckIcon className="q-checkbox__icon-check" />
              <DashIcon className="q-checkbox__icon-dash" />
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
