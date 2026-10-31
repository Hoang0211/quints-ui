import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CloseIcon } from "../../icons/CloseIcon";
import { STATUS_ICONS } from "../../icons/StatusIcons";
import { cx } from "../../utils/cx";
import "./Toast.css";

export type ToastVariant = "neutral" | "success" | "warning" | "alert" | "info";

export type ToastProviderProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Provider>;

export type ToastViewportProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;

const ToastViewport = forwardRef<ComponentRef<typeof ToastPrimitive.Viewport>, ToastViewportProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-toast__viewport", className);
    return <ToastPrimitive.Viewport ref={ref} className={classes} {...rest} />;
  },
);

ToastViewport.displayName = "Toast.Viewport";

export interface ToastProps extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
  icon?: ReactNode;
  showCloseButton?: boolean;
}

const ToastRoot = forwardRef<ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ variant = "neutral", icon, showCloseButton = true, className, children, ...rest }, ref) => {
    const classes = cx("q-toast", `q-toast--${variant}`, className);
    const resolvedIcon = icon ?? (variant === "neutral" ? null : STATUS_ICONS[variant]);

    return (
      <ToastPrimitive.Root ref={ref} className={classes} {...rest}>
        {resolvedIcon && (
          <span className="q-toast__icon" aria-hidden="true">
            {resolvedIcon}
          </span>
        )}
        <div className="q-toast__content">{children}</div>
        {showCloseButton && (
          <ToastPrimitive.Close className="q-toast__close" aria-label="Close">
            <CloseIcon />
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  },
);

ToastRoot.displayName = "Toast";

export type ToastTitleProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Title>;

const ToastTitle = forwardRef<ComponentRef<typeof ToastPrimitive.Title>, ToastTitleProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-toast__title", className);
    return <ToastPrimitive.Title ref={ref} className={classes} {...rest} />;
  },
);

ToastTitle.displayName = "Toast.Title";

export type ToastDescriptionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Description>;

const ToastDescription = forwardRef<
  ComponentRef<typeof ToastPrimitive.Description>,
  ToastDescriptionProps
>(({ className, ...rest }, ref) => {
  const classes = cx("q-toast__description", className);
  return <ToastPrimitive.Description ref={ref} className={classes} {...rest} />;
});

ToastDescription.displayName = "Toast.Description";

export type ToastActionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Action>;

const ToastAction = forwardRef<ComponentRef<typeof ToastPrimitive.Action>, ToastActionProps>(
  ({ className, ...rest }, ref) => {
    const classes = cx("q-toast__action", className);
    return <ToastPrimitive.Action ref={ref} className={classes} {...rest} />;
  },
);

ToastAction.displayName = "Toast.Action";

export type ToastCloseProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Close>;

export const Toast = Object.assign(ToastRoot, {
  Provider: ToastPrimitive.Provider,
  Viewport: ToastViewport,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastPrimitive.Close,
});
