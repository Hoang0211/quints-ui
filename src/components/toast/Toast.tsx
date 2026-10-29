import {
  forwardRef,
  useEffect,
  useRef,
  useState,
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

export interface ToastActionOptions {
  label: ReactNode;
  /** Describes the action for screen reader users, e.g. "Undo the deletion". */
  altText: string;
  onClick?: () => void;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  icon?: ReactNode;
  action?: ToastActionOptions;
  showCloseButton?: boolean;
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

type ToastEvent = { type: "add"; toast: ToastRecord } | { type: "dismiss"; id?: string };

// Mounted <Toaster /> instances subscribe here, so toast() can be called from
// anywhere without a context provider wrapping the caller.
const listeners = new Set<(event: ToastEvent) => void>();
let toastCount = 0;

function emit(event: ToastEvent) {
  listeners.forEach((listener) => listener(event));
}

function toast(options: ToastOptions): string {
  toastCount += 1;
  const id = String(toastCount);
  emit({ type: "add", toast: { ...options, id, open: true } });
  return id;
}

function dismiss(id?: string) {
  emit({ type: "dismiss", id });
}

export function useToast() {
  return { toast, dismiss };
}

// Closed toasts stay in state briefly so Radix can play the exit animation
// before they're removed.
const REMOVE_DELAY = 1000;

export type ToasterProps = ToastViewportProps;

export const Toaster = forwardRef<ComponentRef<typeof ToastPrimitive.Viewport>, ToasterProps>(
  (props, ref) => {
    const [toasts, setToasts] = useState<ToastRecord[]>([]);
    const removeTimers = useRef(new Map<string, number>());

    const closeToasts = (id?: string) => {
      setToasts((current) =>
        current.map((item) =>
          id === undefined || item.id === id ? { ...item, open: false } : item,
        ),
      );
    };

    useEffect(() => {
      const listener = (event: ToastEvent) => {
        if (event.type === "add") {
          setToasts((current) => [...current, event.toast]);
        } else {
          closeToasts(event.id);
        }
      };
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    useEffect(() => {
      const timers = removeTimers.current;
      toasts.forEach((item) => {
        if (item.open || timers.has(item.id)) return;
        timers.set(
          item.id,
          window.setTimeout(() => {
            timers.delete(item.id);
            setToasts((current) => current.filter((other) => other.id !== item.id));
          }, REMOVE_DELAY),
        );
      });
    }, [toasts]);

    useEffect(() => {
      const timers = removeTimers.current;
      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers.clear();
      };
    }, []);

    return (
      <ToastPrimitive.Provider>
        {toasts.map(({ id, open, title, description, action, ...options }) => (
          <ToastRoot
            key={id}
            open={open}
            onOpenChange={(next) => {
              if (!next) closeToasts(id);
            }}
            {...options}
          >
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action && (
              <ToastAction altText={action.altText} onClick={action.onClick}>
                {action.label}
              </ToastAction>
            )}
          </ToastRoot>
        ))}
        <ToastViewport ref={ref} {...props} />
      </ToastPrimitive.Provider>
    );
  },
);

Toaster.displayName = "Toaster";
