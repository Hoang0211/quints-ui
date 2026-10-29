import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cx } from "../../utils/cx";
import "./Dropdown.css";

export type DropdownSize = "sm" | "md";
export type DropdownSide = "top" | "right" | "bottom" | "left";
export type DropdownAlign = "start" | "center" | "end";

export type DropdownProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>;

export type DropdownTriggerProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>;

export interface DropdownContentProps extends ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> {
  size?: DropdownSize;
  side?: DropdownSide;
  align?: DropdownAlign;
}

const DropdownContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownContentProps
>(({ size = "md", side = "bottom", align = "start", sideOffset = 4, className, ...rest }, ref) => {
  const classes = cx("q-dropdown__content", `q-dropdown__content--${size}`, className);

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        className={classes}
        side={side}
        align={align}
        sideOffset={sideOffset}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownContent.displayName = "Dropdown.Content";

export interface DropdownItemProps extends ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> {
  icon?: ReactNode;
  shortcut?: ReactNode;
}

const DropdownItem = forwardRef<ComponentRef<typeof DropdownMenuPrimitive.Item>, DropdownItemProps>(
  ({ icon, shortcut, className, children, ...rest }, ref) => {
    const classes = cx("q-dropdown__item", className);

    return (
      <DropdownMenuPrimitive.Item ref={ref} className={classes} {...rest}>
        {icon && (
          <span className="q-dropdown__item-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="q-dropdown__item-label">{children}</span>
        {shortcut && (
          <span className="q-dropdown__item-shortcut" aria-hidden="true">
            {shortcut}
          </span>
        )}
      </DropdownMenuPrimitive.Item>
    );
  },
);

DropdownItem.displayName = "Dropdown.Item";

export type DropdownLabelProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>;

const DropdownLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownLabelProps
>(({ className, ...rest }, ref) => {
  const classes = cx("q-dropdown__label", className);
  return <DropdownMenuPrimitive.Label ref={ref} className={classes} {...rest} />;
});

DropdownLabel.displayName = "Dropdown.Label";

export type DropdownSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownSeparatorProps
>(({ className, ...rest }, ref) => {
  const classes = cx("q-dropdown__separator", className);
  return <DropdownMenuPrimitive.Separator ref={ref} className={classes} {...rest} />;
});

DropdownSeparator.displayName = "Dropdown.Separator";

export const Dropdown = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger: DropdownMenuPrimitive.Trigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
});
