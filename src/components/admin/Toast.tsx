"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createId, cx } from "@/lib/admin/utils";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: string;
  tone: ToastTone;
  message: string;
};

type ToastContextValue = {
  /** Shows a toast. Returns its id so callers can dismiss it early. */
  notify: (message: string, tone?: ToastTone) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_TIMEOUT_MS = 5000;

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-brand-lime/40 bg-brand-lime/15 text-brand-lime",
  error: "border-red-400/40 bg-red-500/15 text-red-200",
  info: "border-brand-teal/40 bg-brand-teal/15 text-brand-teal",
};

/**
 * Toast provider. The live region is always mounted (even when empty) so screen
 * readers announce later messages instead of missing the first one.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = createId("toast");
      setToasts((current) => [...current, { id, tone, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), TOAST_TIMEOUT_MS),
      );
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        data-testid="toast-region"
        className="pointer-events-none fixed bottom-4 left-1/2 z-[200] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cx(
              "pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur",
              TONE_STYLES[toast.tone],
            )}
          >
            <p className="font-sans text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access toasts from any admin component. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>.");
  }
  return context;
}
