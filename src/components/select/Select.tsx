import { forwardRef, useId, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon } from "../../icons/CheckIcon";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../icons/ChevronUpIcon";
import { cx } from "../../utils/cx";
import "./Select.css";

export type SelectSize = "sm" | "md";

export interface SelectProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  size?: SelectSize;
  fullWidth?: boolean;
  className?: string;
  id?: string;
}

const SelectRoot = forwardRef<ComponentRef<typeof SelectPrimitive.Trigger>, SelectProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      placeholder = "Select an option",
      size = "md",
      fullWidth = false,
      disabled,
      className,
      id,
      children,
      ...rootProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const helperId = `${triggerId}-helper`;
    const helperContent = error && errorMessage ? errorMessage : helperText;

    const wrapperClasses = cx(
      "q-select",
      error && "q-select--error",
      fullWidth && "q-select--full-width",
      className,
    );

    const triggerClasses = cx("q-select__trigger", `q-select__trigger--${size}`);

    const helperClasses = cx("q-select__helper", error && "q-select__helper--error");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="q-select__label" htmlFor={triggerId}>
            {label}
          </label>
        )}
        <SelectPrimitive.Root disabled={disabled} {...rootProps}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={triggerId}
            className={triggerClasses}
            aria-invalid={error || undefined}
            aria-describedby={helperContent ? helperId : undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className="q-select__icon">
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="q-select__content" position="popper" sideOffset={4}>
              <SelectPrimitive.ScrollUpButton className="q-select__scroll-button">
                <ChevronUpIcon />
              </SelectPrimitive.ScrollUpButton>
              <SelectPrimitive.Viewport className="q-select__viewport">
                {children}
              </SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="q-select__scroll-button">
                <ChevronDownIcon />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {helperContent && (
          <div id={helperId} className={helperClasses}>
            {helperContent}
          </div>
        )}
      </div>
    );
  },
);

SelectRoot.displayName = "Select";

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

const SelectItem = forwardRef<ComponentRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = cx("q-select__item", className);
    return (
      <SelectPrimitive.Item ref={ref} className={classes} {...rest}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="q-select__item-indicator">
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  },
);

SelectItem.displayName = "Select.Item";

export type SelectGroupProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

const SelectGroup = forwardRef<ComponentRef<typeof SelectPrimitive.Group>, SelectGroupProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-select__group", className);
    return <SelectPrimitive.Group ref={ref} className={classes} {...rest} />;
  },
);

SelectGroup.displayName = "Select.Group";

export type SelectGroupLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

const SelectGroupLabel = forwardRef<
  ComponentRef<typeof SelectPrimitive.Label>,
  SelectGroupLabelProps
>(({ className, ...rest }, ref) => {
  const classes = cx("q-select__group-label", className);
  return <SelectPrimitive.Label ref={ref} className={classes} {...rest} />;
});

SelectGroupLabel.displayName = "Select.GroupLabel";

export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});
