import { forwardRef, useCallback, useState, type HTMLAttributes, type ReactNode } from "react";
import { UserIcon } from "../../icons/UserIcon";
import { cx } from "../../utils/cx";
import { getInitials } from "./Avatar.utils";
import "./Avatar.css";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** The person or entity's name: the avatar's accessible name and the source of its initials. Omit to make the avatar decorative. */
  name?: string;
  /** Shown while the image loads or if it fails. Defaults to initials from `name`, then a generic icon. */
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, name, fallback, size = "md", shape = "circle", className, ...rest }, ref) => {
    // Track which src loaded/failed rather than a single status flag, so a
    // new src automatically starts over without resetting state in an effect.
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const isLoaded = src !== undefined && loadedSrc === src;
    const hasFailed = src !== undefined && failedSrc === src;

    // An image that finished loading before React attached onLoad (cached, or
    // during hydration) never fires the event, so check on mount too.
    const imageRef = useCallback((image: HTMLImageElement | null) => {
      if (image?.complete && image.naturalWidth > 0) {
        setLoadedSrc(image.getAttribute("src"));
      }
    }, []);

    const classes = cx("q-avatar", `q-avatar--${size}`, `q-avatar--${shape}`, className);

    const initials = name ? getInitials(name) : "";
    const fallbackContent = fallback ?? (initials || <UserIcon className="q-avatar__icon" />);

    return (
      <span
        ref={ref}
        className={classes}
        role={name ? "img" : undefined}
        aria-label={name || undefined}
        aria-hidden={name ? undefined : true}
        {...rest}
      >
        {src && !hasFailed && (
          <img
            ref={imageRef}
            className={cx("q-avatar__image", isLoaded && "q-avatar__image--loaded")}
            src={src}
            alt=""
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
          />
        )}
        {!isLoaded && (
          <span className="q-avatar__fallback" aria-hidden="true">
            {fallbackContent}
          </span>
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
