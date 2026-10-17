import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { STATUS_ICONS } from "../../icons/StatusIcons";
import "./Alert.css";

export type AlertVariant = "success" | "warning" | "alert" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = "info", title, icon, dismissible = false, onDismiss, className, children, ...rest },
    ref,
  ) => {
    const classes = ["q-alert", `q-alert--${variant}`, className].filter(Boolean).join(" ");
    const resolvedIcon = icon ?? STATUS_ICONS[variant];

    return (
      <div ref={ref} className={classes} role="alert" {...rest}>
        <span className="q-alert__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
        <div className="q-alert__content">
          {title && <div className="q-alert__title">{title}</div>}
          {children && <div className="q-alert__description">{children}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            className="q-alert__dismiss"
            onClick={onDismiss}
            aria-label={title ? `Dismiss ${title}` : "Dismiss"}
          >
            <CloseIcon className="q-alert__dismiss-icon" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
