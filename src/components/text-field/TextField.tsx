import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { useField } from "../../hooks/useField";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
import "./TextField.css";

export type TextFieldVariant = "outline" | "filled";
export type TextFieldSize = "sm" | "md";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      variant = "outline",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const field = useField({ id, helperText, error, errorMessage });

    const wrapperClasses = cx(
      "q-text-field",
      `q-text-field--${variant}`,
      `q-text-field--${size}`,
      error && "q-text-field--error",
      fullWidth && "q-text-field--full-width",
      disabled && "q-text-field--disabled",
      className,
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-text-field__label" htmlFor={field.controlId}>
            {label}
          </label>
        )}
        <div className="q-text-field__control">
          {leftIcon && (
            <span className="q-text-field__icon q-text-field__icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            {...field.controlProps}
            className="q-text-field__input"
            disabled={disabled}
            {...rest}
          />
          {rightIcon && (
            <span className="q-text-field__icon q-text-field__icon--right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        <FieldHelper block="q-text-field" {...field.helperProps} />
      </div>
    );
  },
);

TextField.displayName = "TextField";
