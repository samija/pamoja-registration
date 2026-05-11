"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function showToast(message: string, type: Toast["type"] = "info") {
  const toast: Toast = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(toast));
}

const styles = {
  success: "bg-pamoja-lime/90 text-pamoja-green-deep",
  info: "bg-pamoja-charcoal/90 text-white",
  error: "bg-red-500/90 text-white",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in ${styles[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
