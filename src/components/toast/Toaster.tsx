import { forwardRef, type ComponentRef } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Toast, type ToastViewportProps } from "./Toast";
import { useToastQueue } from "./useToast";

export type ToasterProps = ToastViewportProps;

// Renders the toasts queued through useToast().toast(), so consumers only
// mount <Toaster /> once instead of composing <Toast> parts themselves.
export const Toaster = forwardRef<ComponentRef<typeof ToastPrimitive.Viewport>, ToasterProps>(
  (props, ref) => {
    const { toasts, closeToasts } = useToastQueue();

    return (
      <Toast.Provider>
        {toasts.map(({ id, open, title, description, action, ...options }) => (
          <Toast
            key={id}
            open={open}
            onOpenChange={(next) => {
              if (!next) closeToasts(id);
            }}
            {...options}
          >
            {title && <Toast.Title>{title}</Toast.Title>}
            {description && <Toast.Description>{description}</Toast.Description>}
            {action && (
              <Toast.Action altText={action.altText} onClick={action.onClick}>
                {action.label}
              </Toast.Action>
            )}
          </Toast>
        ))}
        <Toast.Viewport ref={ref} {...props} />
      </Toast.Provider>
    );
  },
);

Toaster.displayName = "Toaster";
