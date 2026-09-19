import { forwardRef, useId, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
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

    const wrapperClasses = [
      "q-select",
      error && "q-select--error",
      fullWidth && "q-select--full-width",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const triggerClasses = ["q-select__trigger", `q-select__trigger--${size}`]
      .filter(Boolean)
      .join(" ");

    const helperClasses = ["q-select__helper", error && "q-select__helper--error"]
      .filter(Boolean)
      .join(" ");

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
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path
                  d="M4 6l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="q-select__content" position="popper" sideOffset={4}>
              <SelectPrimitive.ScrollUpButton className="q-select__scroll-button">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path
                    d="M4 10l4-4 4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SelectPrimitive.ScrollUpButton>
              <SelectPrimitive.Viewport className="q-select__viewport">
                {children}
              </SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="q-select__scroll-button">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
    const classes = ["q-select__item", className].filter(Boolean).join(" ");
    return (
      <SelectPrimitive.Item ref={ref} className={classes} {...rest}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className="q-select__item-indicator">
          <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path
              d="M2.5 6.5l2.5 2.5 4.5-5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  },
);

SelectItem.displayName = "Select.Item";

export type SelectGroupProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

const SelectGroup = forwardRef<ComponentRef<typeof SelectPrimitive.Group>, SelectGroupProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-select__group", className].filter(Boolean).join(" ");
    return <SelectPrimitive.Group ref={ref} className={classes} {...rest} />;
  },
);

SelectGroup.displayName = "Select.Group";

export type SelectGroupLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

const SelectGroupLabel = forwardRef<
  ComponentRef<typeof SelectPrimitive.Label>,
  SelectGroupLabelProps
>(({ className, ...rest }, ref) => {
  const classes = ["q-select__group-label", className].filter(Boolean).join(" ");
  return <SelectPrimitive.Label ref={ref} className={classes} {...rest} />;
});

SelectGroupLabel.displayName = "Select.GroupLabel";

export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});
