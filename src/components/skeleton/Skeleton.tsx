import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import "./Skeleton.css";

export type SkeletonVariant = "text" | "rect" | "circle";
export type SkeletonAnimation = "pulse" | "none";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  /** Number of text lines to render, the last one shorter. Only applies to the `text` variant without children. */
  lines?: number;
  /** When `false`, renders `children` as-is instead of the skeleton. */
  loading?: boolean;
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    {
      variant = "text",
      animation = "pulse",
      width,
      height,
      lines = 1,
      loading = true,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    if (!loading) return <>{children}</>;

    const hasChildren = children !== undefined && children !== null;
    const shapeClasses = ["q-skeleton", `q-skeleton--${variant}`, `q-skeleton--${animation}`];

    // Skeletons are decorative placeholders, hidden from assistive tech. The
    // surrounding region should carry aria-busy while content loads.
    if (variant === "text" && lines > 1 && !hasChildren) {
      const classes = ["q-skeleton__lines", className].filter(Boolean).join(" ");
      return (
        <span
          ref={ref}
          className={classes}
          style={{ width, ...style }}
          aria-hidden="true"
          {...rest}
        >
          {Array.from({ length: lines }, (_, index) => (
            <span key={index} className={shapeClasses.join(" ")} />
          ))}
        </span>
      );
    }

    const classes = [...shapeClasses, hasChildren && "q-skeleton--has-children", className]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        style={{ width, height, ...style }}
        aria-hidden="true"
        {...rest}
      >
        {/* Rendered invisibly so the skeleton takes the real content's size. */}
        {hasChildren && <span className="q-skeleton__content">{children}</span>}
      </span>
    );
  },
);

Skeleton.displayName = "Skeleton";
