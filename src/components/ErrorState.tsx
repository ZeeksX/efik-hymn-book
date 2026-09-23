import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load the hymn collection or requested content.",
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] my-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-950/40 text-[var(--color-error)] mb-4">
        <AlertCircle size={28} />
      </div>
      <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] max-w-md leading-relaxed">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] font-medium text-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] font-medium text-sm transition-colors"
        >
          <Home size={16} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
