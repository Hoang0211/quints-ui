import { forwardRef, type HTMLAttributes } from "react";
import "./Card.css";

export type CardVariant = "elevated" | "outlined" | "flat";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", className, ...rest }, ref) => {
    const classes = ["q-card", `q-card--${variant}`, className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...rest} />;
  },
);
CardRoot.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...rest }, ref) => {
  const classes = ["q-card__header", className].filter(Boolean).join(" ");
  return <div ref={ref} className={classes} {...rest} />;
});
CardHeader.displayName = "Card.Header";

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...rest }, ref) => {
  const classes = ["q-card__title", className].filter(Boolean).join(" ");
  return <h3 ref={ref} className={classes} {...rest} />;
});
CardTitle.displayName = "Card.Title";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-card__description", className].filter(Boolean).join(" ");
    return <p ref={ref} className={classes} {...rest} />;
  },
);
CardDescription.displayName = "Card.Description";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...rest }, ref) => {
  const classes = ["q-card__content", className].filter(Boolean).join(" ");
  return <div ref={ref} className={classes} {...rest} />;
});
CardContent.displayName = "Card.Content";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...rest }, ref) => {
  const classes = ["q-card__footer", className].filter(Boolean).join(" ");
  return <div ref={ref} className={classes} {...rest} />;
});
CardFooter.displayName = "Card.Footer";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
