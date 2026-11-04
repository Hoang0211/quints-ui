import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useField } from "../../hooks/useField";
import { CheckIcon } from "../../icons/CheckIcon";
import { DashIcon } from "../../icons/DashIcon";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
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
    const field = useField({ id, helperText, error, errorMessage });

    const wrapperClasses = cx(
      "q-checkbox",
      `q-checkbox--${size}`,
      error && "q-checkbox--error",
      disabled && "q-checkbox--disabled",
      className,
    );

    return (
      <div className={wrapperClasses}>
        <div className="q-checkbox__row">
          <CheckboxPrimitive.Root
            ref={ref}
            {...field.controlProps}
            disabled={disabled}
            className="q-checkbox__control"
            {...rest}
          >
            <CheckboxPrimitive.Indicator className="q-checkbox__indicator">
              <CheckIcon className="q-checkbox__icon-check" />
              <DashIcon className="q-checkbox__icon-dash" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          {label && (
            <label className="q-checkbox__label" htmlFor={field.controlId}>
              {label}
            </label>
          )}
        </div>
        <FieldHelper block="q-checkbox" {...field.helperProps} />
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
