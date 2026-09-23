import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Modal — centered dialog on desktop, bottom sheet on mobile          */
/* ------------------------------------------------------------------ */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
};

function useModalBehaviour(open: boolean, onClose: () => void, panelRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      // Basic focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('input, button:not([data-close])')?.focus();
    }, 40);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(timer);
    };
  }, [open, onClose, panelRef]);
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehaviour(open, onClose, panelRef);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 animate-overlay-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizeClasses[size]} bg-surface border border-border rounded-t-2xl sm:rounded-2xl shadow-xl animate-sheet-up sm:animate-dialog-in max-h-[92vh] sm:max-h-[85vh] flex flex-col`}
      >
        {/* Drag handle (mobile affordance) */}
        <div className="sm:hidden pt-2.5 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-border-strong/60" aria-hidden />
        </div>

        {title && (
          <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-4 sm:pt-5 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">{title}</h2>
              {description && (
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              data-close
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors shrink-0 focus-ring"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="px-5 sm:px-6 pb-5 sm:pb-6 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-border flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Drawer — right side panel                                           */
/* ------------------------------------------------------------------ */

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'left';
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehaviour(open, onClose, panelRef);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 animate-overlay-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 bottom-0 ${side === 'right' ? 'right-0' : 'left-0'} w-full max-w-md bg-surface border-${
          side === 'right' ? 'l' : 'r'
        } border-border shadow-xl flex flex-col animate-sheet-up sm:animate-dialog-in`}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-foreground">{title}</h2>
            <button
              type="button"
              data-close
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-lg text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ConfirmDialog — destructive action confirmation                     */
/* ------------------------------------------------------------------ */

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-9 px-4 rounded-[10px] text-sm font-semibold transition-colors focus-ring ${
              destructive
                ? 'bg-danger text-white hover:opacity-90'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover'
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
    </Modal>
  );
};
