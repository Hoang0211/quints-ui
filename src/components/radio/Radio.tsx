import { forwardRef, useId, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useField } from "../../hooks/useField";
import { cx } from "../../utils/cx";
import { FieldHelper } from "../field/FieldHelper";
import "./Radio.css";

export type RadioGroupOrientation = "horizontal" | "vertical";
export type RadioGroupSize = "sm" | "md";

export interface RadioGroupProps extends Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "orientation"
> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  orientation?: RadioGroupOrientation;
  size?: RadioGroupSize;
}

const RadioGroupRoot = forwardRef<ComponentRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      orientation = "vertical",
      size = "md",
      disabled,
      className,
      id,
      children,
      ...rest
    },
    ref,
  ) => {
    const field = useField({ id, helperText, error, errorMessage });
    const labelId = `${field.controlId}-label`;

    const wrapperClasses = cx(
      "q-radio-group",
      `q-radio-group--${size}`,
      error && "q-radio-group--error",
      disabled && "q-radio-group--disabled",
      className,
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <span className="q-radio-group__label" id={labelId}>
            {label}
          </span>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          {...field.controlProps}
          orientation={orientation}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          className={`q-radio-group__items q-radio-group__items--${orientation}`}
          {...rest}
        >
          {children}
        </RadioGroupPrimitive.Root>
        <FieldHelper block="q-radio-group" {...field.helperProps} />
      </div>
    );
  },
);

RadioGroupRoot.displayName = "RadioGroup";

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

const RadioGroupItem = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, id, children, ...rest }, ref) => {
  const generatedId = useId();
  const itemId = id ?? generatedId;
  const wrapperClasses = cx("q-radio-group__item", className);

  return (
    <div className={wrapperClasses}>
      <RadioGroupPrimitive.Item ref={ref} id={itemId} className="q-radio-group__control" {...rest}>
        <RadioGroupPrimitive.Indicator className="q-radio-group__indicator" />
      </RadioGroupPrimitive.Item>
      {children && (
        <label className="q-radio-group__item-label" htmlFor={itemId}>
          {children}
        </label>
      )}
    </div>
  );
});

RadioGroupItem.displayName = "RadioGroup.Item";

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
