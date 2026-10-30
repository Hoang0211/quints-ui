import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { UserIcon } from "../../icons/UserIcon";
import { cx } from "../../utils/cx";
import { useImageStatus } from "./useImageStatus";
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
    const { isLoaded, hasFailed, imageRef, handleLoad, handleError } = useImageStatus(src);

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
            onLoad={handleLoad}
            onError={handleError}
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
