import { forwardRef, useId, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
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
    const generatedId = useId();
    const groupId = id ?? generatedId;
    const labelId = `${groupId}-label`;
    const helperId = `${groupId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = [
      "q-radio-group",
      `q-radio-group--${size}`,
      error && "q-radio-group--error",
      disabled && "q-radio-group--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-radio-group__helper", error && "q-radio-group__helper--error"]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <span className="q-radio-group__label" id={labelId}>
            {label}
          </span>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          id={groupId}
          orientation={orientation}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={helperContent ? helperId : undefined}
          aria-invalid={error || undefined}
          className={`q-radio-group__items q-radio-group__items--${orientation}`}
          {...rest}
        >
          {children}
        </RadioGroupPrimitive.Root>
        {helperContent && (
          <div id={helperId} className={helperClasses}>
            {helperContent}
          </div>
        )}
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
  const wrapperClasses = ["q-radio-group__item", className].filter(Boolean).join(" ");

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
