import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextType {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-3), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );

  const toneStyles: Record<ToastTone, string> = {
    success: 'text-success',
    error: 'text-danger',
    info: 'text-primary',
  };

  const icons: Record<ToastTone, React.ReactNode> = {
    success: <CheckCircle2 size={17} />,
    error: <AlertCircle size={17} />,
    info: <Info size={17} />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast viewport — restrained, bottom-center above mobile nav */}
      <div
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none px-4 w-full sm:w-auto"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 bg-surface-elevated border border-border-strong/70 rounded-xl shadow-lg py-2.5 pl-3.5 pr-2.5 max-w-sm animate-toast-in"
          >
            <span className={toneStyles[t.tone]}>{icons[t.tone]}</span>
            <p className="text-sm text-foreground">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md text-subtle-foreground hover:text-foreground transition-colors focus-ring"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
