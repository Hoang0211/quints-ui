import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useField } from "../../hooks/useField";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
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
    const field = useField({ id, helperText, error, errorMessage });

    const wrapperClasses = cx(
      "q-toggle",
      `q-toggle--${size}`,
      error && "q-toggle--error",
      disabled && "q-toggle--disabled",
      className,
    );

    const control = (
      <SwitchPrimitive.Root
        ref={ref}
        {...field.controlProps}
        disabled={disabled}
        className="q-toggle__control"
        {...rest}
      >
        <SwitchPrimitive.Thumb className="q-toggle__thumb" />
      </SwitchPrimitive.Root>
    );

    const labelElement = label && (
      <label className="q-toggle__label" htmlFor={field.controlId}>
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
        <FieldHelper block="q-toggle" {...field.helperProps} />
      </div>
    );
  },
);

Toggle.displayName = "Toggle";
