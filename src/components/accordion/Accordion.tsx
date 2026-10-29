import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { AccordionSingleProps } from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { cx } from "../../utils/cx";
import "./Accordion.css";

export type AccordionProps = Omit<AccordionSingleProps, "type">;

const AccordionRoot = forwardRef<ComponentRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ className, collapsible = false, ...rest }, ref) => {
    const classes = cx("q-accordion", className);
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
    const classes = cx("q-accordion__item", className);
    return <AccordionPrimitive.Item ref={ref} className={classes} {...rest} />;
  },
);

AccordionItem.displayName = "Accordion.Item";

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...rest }, ref) => {
  const classes = cx("q-accordion__trigger", className);
  return (
    <AccordionPrimitive.Header className="q-accordion__header">
      <AccordionPrimitive.Trigger ref={ref} className={classes} {...rest}>
        <span className="q-accordion__trigger-label">{children}</span>
        <ChevronDownIcon className="q-accordion__chevron" />
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
  const classes = cx("q-accordion__content", className);
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
