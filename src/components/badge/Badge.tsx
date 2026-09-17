import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./Badge.css";

export type BadgeVariant =
  "primary" | "secondary" | "neutral" | "success" | "warning" | "alert" | "info";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "neutral", icon, removable = false, onRemove, className, children, ...rest },
    ref,
  ) => {
    const classes = ["q-badge", `q-badge--${variant}`, className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {icon && (
          <span className="q-badge__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="q-badge__label">{children}</span>
        {removable && (
          <button
            type="button"
            className="q-badge__remove"
            onClick={onRemove}
            aria-label={typeof children === "string" ? `Remove ${children}` : "Remove"}
          >
            <svg
              className="q-badge__remove-icon"
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
      </span>
    );
  },
);

Badge.displayName = "Badge";
