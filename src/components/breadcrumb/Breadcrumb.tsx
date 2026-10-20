import {
  Children,
  Fragment,
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import "./Breadcrumb.css";

export type BreadcrumbSize = "sm" | "md";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  size?: BreadcrumbSize;
  /** Rendered between items. Defaults to a chevron icon. */
  separator?: ReactNode;
}

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      size = "md",
      separator = <ChevronRightIcon />,
      "aria-label": ariaLabel = "Breadcrumb",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = ["q-breadcrumb", `q-breadcrumb--${size}`, className].filter(Boolean).join(" ");
    // toArray drops null/false children, so conditionally rendered items
    // don't leave a dangling separator.
    const items = Children.toArray(children);

    return (
      <nav ref={ref} className={classes} aria-label={ariaLabel} {...rest}>
        <ol className="q-breadcrumb__list">
          {items.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <li className="q-breadcrumb__separator" role="presentation" aria-hidden="true">
                  {separator}
                </li>
              )}
              {item}
            </Fragment>
          ))}
        </ol>
      </nav>
    );
  },
);

BreadcrumbRoot.displayName = "Breadcrumb";

export type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement>;

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-breadcrumb__item", className].filter(Boolean).join(" ");
    return <li ref={ref} className={classes} {...rest} />;
  },
);

BreadcrumbItem.displayName = "Breadcrumb.Item";

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Merge props onto the child element instead, e.g. a router's `Link`. */
  asChild?: boolean;
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, className, ...rest }, ref) => {
    const classes = ["q-breadcrumb__link", className].filter(Boolean).join(" ");
    const Component = asChild ? Slot : "a";
    return <Component ref={ref} className={classes} {...rest} />;
  },
);

BreadcrumbLink.displayName = "Breadcrumb.Link";

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-breadcrumb__page", className].filter(Boolean).join(" ");
    return <span ref={ref} className={classes} aria-current="page" {...rest} />;
  },
);

BreadcrumbPage.displayName = "Breadcrumb.Page";

export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  /** Screen reader text for the collapsed items. */
  label?: string;
}

const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ label = "More pages", className, ...rest }, ref) => {
    const classes = ["q-breadcrumb__ellipsis", className].filter(Boolean).join(" ");
    return (
      <span ref={ref} className={classes} {...rest}>
        <span aria-hidden="true">…</span>
        <span className="q-breadcrumb__sr-only">{label}</span>
      </span>
    );
  },
);

BreadcrumbEllipsis.displayName = "Breadcrumb.Ellipsis";

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Ellipsis: BreadcrumbEllipsis,
});
