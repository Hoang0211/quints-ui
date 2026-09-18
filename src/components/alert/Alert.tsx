import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./Alert.css";

export type AlertVariant = "success" | "warning" | "alert" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  success: (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8l2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M8 2L1 14h14L8 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="6.5"
        x2="8"
        y2="9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 5.5l5 5M10.5 5.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="8"
        y1="7"
        x2="8"
        y2="11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="4.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = "info", title, icon, dismissible = false, onDismiss, className, children, ...rest },
    ref,
  ) => {
    const classes = ["q-alert", `q-alert--${variant}`, className].filter(Boolean).join(" ");
    const resolvedIcon = icon ?? DEFAULT_ICONS[variant];

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
            <svg
              className="q-alert__dismiss-icon"
              viewBox="0 0 12 12"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
