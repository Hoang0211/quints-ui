import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ToastVariant } from "./Toast";

export interface ToastActionOptions {
  label: ReactNode;
  /** Describes the action for screen reader users, e.g. "Undo the deletion". */
  altText: string;
  onClick?: () => void;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  icon?: ReactNode;
  action?: ToastActionOptions;
  showCloseButton?: boolean;
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

type ToastEvent = { type: "add"; toast: ToastRecord } | { type: "dismiss"; id?: string };

// Mounted <Toaster /> instances subscribe here, so toast() can be called from
// anywhere without a context provider wrapping the caller.
const listeners = new Set<(event: ToastEvent) => void>();
let toastCount = 0;

function emit(event: ToastEvent) {
  listeners.forEach((listener) => listener(event));
}

function toast(options: ToastOptions): string {
  toastCount += 1;
  const id = String(toastCount);
  emit({ type: "add", toast: { ...options, id, open: true } });
  return id;
}

function dismiss(id?: string) {
  emit({ type: "dismiss", id });
}

export function useToast() {
  return { toast, dismiss };
}

// Closed toasts stay in state briefly so Radix can play the exit animation
// before they're removed.
const REMOVE_DELAY = 1000;

// The state behind <Toaster />: subscribes to toast()/dismiss() calls and
// removes each closed toast once its exit animation has had time to play.
export function useToastQueue() {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const removeTimers = useRef(new Map<string, number>());

  const closeToasts = (id?: string) => {
    setToasts((current) =>
      current.map((item) => (id === undefined || item.id === id ? { ...item, open: false } : item)),
    );
  };

  useEffect(() => {
    const listener = (event: ToastEvent) => {
      if (event.type === "add") {
        setToasts((current) => [...current, event.toast]);
      } else {
        closeToasts(event.id);
      }
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    const timers = removeTimers.current;
    toasts.forEach((item) => {
      if (item.open || timers.has(item.id)) return;
      timers.set(
        item.id,
        window.setTimeout(() => {
          timers.delete(item.id);
          setToasts((current) => current.filter((other) => other.id !== item.id));
        }, REMOVE_DELAY),
      );
    });
  }, [toasts]);

  useEffect(() => {
    const timers = removeTimers.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { toasts, closeToasts };
}
