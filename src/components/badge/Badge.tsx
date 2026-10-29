import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { cx } from "../../utils/cx";
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
    const classes = cx("q-badge", `q-badge--${variant}`, className);

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
            <CloseIcon className="q-badge__remove-icon" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
