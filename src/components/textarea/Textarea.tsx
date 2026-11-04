import { forwardRef, type TextareaHTMLAttributes } from "react";
import { useField } from "../../hooks/useField";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
import "./Textarea.css";

export type TextareaVariant = "outline" | "filled";
export type TextareaSize = "sm" | "md";
export type TextareaResize = "none" | "vertical" | "both";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  resize?: TextareaResize;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "outline",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      resize = "vertical",
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const field = useField({ id, helperText, error, errorMessage });

    const wrapperClasses = cx(
      "q-textarea",
      `q-textarea--${variant}`,
      `q-textarea--${size}`,
      error && "q-textarea--error",
      fullWidth && "q-textarea--full-width",
      disabled && "q-textarea--disabled",
      className,
    );

    const controlClasses = cx("q-textarea__control", `q-textarea__control--${resize}`);

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-textarea__label" htmlFor={field.controlId}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...field.controlProps}
          className={controlClasses}
          disabled={disabled}
          {...rest}
        />
        <FieldHelper block="q-textarea" {...field.helperProps} />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
