import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-[14px] border border-border bg-surface ${
        compact ? 'p-8' : 'p-10 sm:p-14'
      } ${className}`}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-soft text-primary mb-4">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>

      {actionLabel && (actionTo || onAction) && (
        <div className="mt-5">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors focus-ring"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors focus-ring"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load the hymn collection. Please check your connection and try again.",
  onRetry,
  showHome = true,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-10 rounded-[14px] border border-border bg-surface ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-danger-soft text-danger mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-md leading-relaxed">{message}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors focus-ring"
          >
            Try Again
          </button>
        )}
        {showHome && (
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-4 rounded-[10px] border border-border-strong/70 bg-surface text-foreground hover:bg-surface-secondary text-sm font-medium transition-colors focus-ring"
          >
            Return Home
          </Link>
        )}
      </div>
    </div>
  );
};
