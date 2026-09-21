import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import "./Dialog.css";

export type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export interface DialogContentProps extends ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean;
}

const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, showCloseButton = true, ...rest }, ref) => {
    const classes = ["q-dialog__content", className].filter(Boolean).join(" ");

    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="q-dialog__overlay" />
        <DialogPrimitive.Content ref={ref} className={classes} {...rest}>
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="q-dialog__close" aria-label="Close">
              <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);

DialogContent.displayName = "Dialog.Content";

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-dialog__header", className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...rest} />;
  },
);

DialogHeader.displayName = "Dialog.Header";

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

const DialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-dialog__title", className].filter(Boolean).join(" ");
    return <DialogPrimitive.Title ref={ref} className={classes} {...rest} />;
  },
);

DialogTitle.displayName = "Dialog.Title";

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...rest }, ref) => {
  const classes = ["q-dialog__description", className].filter(Boolean).join(" ");
  return <DialogPrimitive.Description ref={ref} className={classes} {...rest} />;
});

DialogDescription.displayName = "Dialog.Description";

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(({ className, ...rest }, ref) => {
  const classes = ["q-dialog__body", className].filter(Boolean).join(" ");
  return <div ref={ref} className={classes} {...rest} />;
});

DialogBody.displayName = "Dialog.Body";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...rest }, ref) => {
    const classes = ["q-dialog__footer", className].filter(Boolean).join(" ");
    return <div ref={ref} className={classes} {...rest} />;
  },
);

DialogFooter.displayName = "Dialog.Footer";

export const Dialog = Object.assign(DialogPrimitive.Root, {
  Trigger: DialogPrimitive.Trigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogPrimitive.Close,
});
