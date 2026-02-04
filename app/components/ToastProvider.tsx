'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs = 3000) => {
    const id = Date.now();
    setToast({ id, message, type });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (durationMs > 0) {
      timeoutRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, durationMs);
    }
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`fixed top-24 right-4 z-[60] px-6 py-4 rounded-lg shadow-xl animate-slide-in border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-500 text-white'
              : 'bg-slate-900/90 border-slate-500 text-white'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div>
              <h4 className="font-bold">
                {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notice'}
              </h4>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
