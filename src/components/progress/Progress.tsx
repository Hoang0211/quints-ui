import { forwardRef, useId, type HTMLAttributes } from "react";
import "./Progress.css";

export type ProgressVariant = "primary" | "success" | "warning" | "alert" | "info";
export type ProgressSize = "sm" | "md" | "lg";
export type ProgressShape = "linear" | "circular";

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Current progress, from 0 to `max`. Omit or pass `null` for an indeterminate state. */
  value?: number | null;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  shape?: ProgressShape;
  /** Visible label, also used as the progress bar's accessible name. */
  label?: string;
  /** Display the rounded percentage. Ignored while indeterminate. */
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      variant = "primary",
      size = "md",
      shape = "linear",
      label,
      showValue = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const labelId = useId();
    const isIndeterminate = value === null || value === undefined;
    const clampedValue = isIndeterminate ? 0 : Math.min(Math.max(value, 0), max);
    const percent = max > 0 ? (clampedValue / max) * 100 : 0;
    const valueText = `${Math.round(percent)}%`;

    const classes = [
      "q-progress",
      `q-progress--${shape}`,
      `q-progress--${variant}`,
      `q-progress--${size}`,
      isIndeterminate && "q-progress--indeterminate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const labelElement = label && (
      <span id={labelId} className="q-progress__label">
        {label}
      </span>
    );
    // Screen readers already announce the percentage from aria-valuenow, so
    // the visible copy is hidden to avoid reading it twice.
    const valueElement = showValue && !isIndeterminate && (
      <span className="q-progress__value" aria-hidden="true">
        {valueText}
      </span>
    );

    return (
      <div
        ref={ref}
        className={classes}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-labelledby={label ? labelId : undefined}
        {...rest}
      >
        {shape === "circular" ? (
          <>
            <span className="q-progress__ring">
              <svg className="q-progress__svg" viewBox="0 0 36 36" aria-hidden="true">
                <circle className="q-progress__ring-track" cx="18" cy="18" r="16" />
                <circle
                  className="q-progress__ring-fill"
                  cx="18"
                  cy="18"
                  r="16"
                  pathLength={100}
                  strokeDasharray={isIndeterminate ? "25 75" : "100 100"}
                  strokeDashoffset={isIndeterminate ? 0 : 100 - percent}
                />
              </svg>
              {valueElement}
            </span>
            {labelElement}
          </>
        ) : (
          <>
            {(labelElement || valueElement) && (
              <span className="q-progress__header">
                {labelElement}
                {valueElement}
              </span>
            )}
            <span className="q-progress__track">
              <span
                className="q-progress__fill"
                style={isIndeterminate ? undefined : { width: `${percent}%` }}
              />
            </span>
          </>
        )}
      </div>
    );
  },
);

Progress.displayName = "Progress";
