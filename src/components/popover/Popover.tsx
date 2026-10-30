import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useRegisterId } from "../../hooks/useRegisterId";
import { CloseIcon } from "../../icons/CloseIcon";
import { cx } from "../../utils/cx";
import "./Popover.css";

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

// Radix Popover renders its content as role="dialog" but, unlike Dialog, has
// no Title/Description primitives to name it. Title and Description register
// here so Content only points aria-labelledby/-describedby at ids that exist.
interface PopoverLabelContextValue {
  titleId: string;
  descriptionId: string;
  setLabelledBy: (id: string | null) => void;
  setDescribedBy: (id: string | null) => void;
}

const PopoverLabelContext = createContext<PopoverLabelContextValue | null>(null);

export interface PopoverContentProps extends ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> {
  side?: PopoverSide;
  align?: PopoverAlign;
  showArrow?: boolean;
  showCloseButton?: boolean;
}

const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      side = "bottom",
      align = "center",
      sideOffset = 6,
      showArrow = false,
      showCloseButton = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const titleId = useId();
    const descriptionId = useId();
    const [labelledBy, setLabelledBy] = useState<string | null>(null);
    const [describedBy, setDescribedBy] = useState<string | null>(null);
    const labelContext = useMemo(
      () => ({ titleId, descriptionId, setLabelledBy, setDescribedBy }),
      [titleId, descriptionId],
    );

    const classes = cx(
      "q-popover__content",
      showCloseButton && "q-popover__content--closable",
      className,
    );

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          className={classes}
          side={side}
          align={align}
          sideOffset={sideOffset}
          aria-labelledby={labelledBy ?? undefined}
          aria-describedby={describedBy ?? undefined}
          {...rest}
        >
          <PopoverLabelContext.Provider value={labelContext}>
            {children}
          </PopoverLabelContext.Provider>
          {showCloseButton && (
            <PopoverPrimitive.Close className="q-popover__close" aria-label="Close">
              <CloseIcon />
            </PopoverPrimitive.Close>
          )}
          {showArrow && <PopoverPrimitive.Arrow className="q-popover__arrow" />}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);

PopoverContent.displayName = "Popover.Content";

export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement>;

const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ className, ...rest }, ref) => {
    const labelContext = useContext(PopoverLabelContext);
    useRegisterId(labelContext?.setLabelledBy, labelContext?.titleId);

    const classes = cx("q-popover__title", className);
    return <h2 ref={ref} className={classes} {...rest} id={labelContext?.titleId ?? rest.id} />;
  },
);

PopoverTitle.displayName = "Popover.Title";

export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  ({ className, ...rest }, ref) => {
    const labelContext = useContext(PopoverLabelContext);
    useRegisterId(labelContext?.setDescribedBy, labelContext?.descriptionId);

    const classes = cx("q-popover__description", className);
    return (
      <p ref={ref} className={classes} {...rest} id={labelContext?.descriptionId ?? rest.id} />
    );
  },
);

PopoverDescription.displayName = "Popover.Description";

export const Popover = Object.assign(PopoverPrimitive.Root, {
  Trigger: PopoverPrimitive.Trigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverPrimitive.Close,
});
