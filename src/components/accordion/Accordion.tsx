import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { AccordionSingleProps } from "@radix-ui/react-accordion";
import "./Accordion.css";

export type AccordionProps = Omit<AccordionSingleProps, "type">;

const AccordionRoot = forwardRef<ComponentRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ className, collapsible = false, ...rest }, ref) => {
    const classes = ["q-accordion", className].filter(Boolean).join(" ");
    return (
      <AccordionPrimitive.Root
        ref={ref}
        type="single"
        collapsible={collapsible}
        className={classes}
        {...rest}
      />
    );
  },
);

AccordionRoot.displayName = "Accordion";

export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const AccordionItem = forwardRef<ComponentRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-accordion__item", className].filter(Boolean).join(" ");
    return <AccordionPrimitive.Item ref={ref} className={classes} {...rest} />;
  },
);

AccordionItem.displayName = "Accordion.Item";

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...rest }, ref) => {
  const classes = ["q-accordion__trigger", className].filter(Boolean).join(" ");
  return (
    <AccordionPrimitive.Header className="q-accordion__header">
      <AccordionPrimitive.Trigger ref={ref} className={classes} {...rest}>
        <span className="q-accordion__trigger-label">{children}</span>
        <svg
          className="q-accordion__chevron"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = "Accordion.Trigger";

export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...rest }, ref) => {
  const classes = ["q-accordion__content", className].filter(Boolean).join(" ");
  return (
    <AccordionPrimitive.Content ref={ref} className={classes} {...rest}>
      <div className="q-accordion__content-inner">{children}</div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = "Accordion.Content";

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
