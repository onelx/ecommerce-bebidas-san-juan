import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastId = 0;
const listeners: Array<(toast: Toast) => void> = [];

export function toast(props: Omit<Toast, 'id'>) {
  const id = String(toastId++);
  const toastData = { ...props, id };
  listeners.forEach((listener) => listener(toastData));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-lg shadow-lg ${
            t.variant === 'destructive'
              ? 'bg-red-500 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && <div className="text-sm">{t.description}</div>}
        </div>
      ))}
    </div>
  );
}
