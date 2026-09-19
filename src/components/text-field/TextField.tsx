import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
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
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = [
      "q-text-field",
      `q-text-field--${variant}`,
      `q-text-field--${size}`,
      error && "q-text-field--error",
      fullWidth && "q-text-field--full-width",
      disabled && "q-text-field--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-text-field__helper", error && "q-text-field__helper--error"]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-text-field__label" htmlFor={inputId}>
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
            id={inputId}
            className="q-text-field__input"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperContent ? helperId : undefined}
            {...rest}
          />
          {rightIcon && (
            <span className="q-text-field__icon q-text-field__icon--right" aria-hidden="true">
              {rightIcon}
            </span>
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

TextField.displayName = "TextField";
