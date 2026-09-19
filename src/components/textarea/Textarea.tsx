import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
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
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = [
      "q-textarea",
      `q-textarea--${variant}`,
      `q-textarea--${size}`,
      error && "q-textarea--error",
      fullWidth && "q-textarea--full-width",
      disabled && "q-textarea--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const controlClasses = ["q-textarea__control", `q-textarea__control--${resize}`]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-textarea__helper", error && "q-textarea__helper--error"]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-textarea__label" htmlFor={textareaId}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={controlClasses}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperContent ? helperId : undefined}
          {...rest}
        />
        {helperContent && (
          <div id={helperId} className={helperClasses}>
            {helperContent}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
