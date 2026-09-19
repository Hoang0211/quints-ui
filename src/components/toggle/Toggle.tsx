import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import "./Toggle.css";

export type ToggleSize = "sm" | "md";
export type ToggleLabelPosition = "left" | "right";

export interface ToggleProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: ReactNode;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  size?: ToggleSize;
  labelPosition?: ToggleLabelPosition;
}

export const Toggle = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, ToggleProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      size = "md",
      labelPosition = "right",
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const toggleId = id ?? generatedId;
    const helperId = `${toggleId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = [
      "q-toggle",
      `q-toggle--${size}`,
      error && "q-toggle--error",
      disabled && "q-toggle--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-toggle__helper", error && "q-toggle__helper--error"]
      .filter(Boolean)
      .join(" ");

    const control = (
      <SwitchPrimitive.Root
        ref={ref}
        id={toggleId}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={helperContent ? helperId : undefined}
        className="q-toggle__control"
        {...rest}
      >
        <SwitchPrimitive.Thumb className="q-toggle__thumb" />
      </SwitchPrimitive.Root>
    );

    const labelElement = label && (
      <label className="q-toggle__label" htmlFor={toggleId}>
        {label}
      </label>
    );

    return (
      <div className={wrapperClasses}>
        <div className="q-toggle__row">
          {labelPosition === "left" && labelElement}
          {control}
          {labelPosition === "right" && labelElement}
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

Toggle.displayName = "Toggle";
