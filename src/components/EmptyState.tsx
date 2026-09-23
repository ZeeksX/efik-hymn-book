import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 my-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--brand-primary-light)] text-[var(--brand-primary)] mb-4">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] max-w-md leading-relaxed">
        {description}
      </p>

      {actionLabel && (actionTo || onAction) && (
        <div className="mt-6">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] font-medium text-sm transition-colors shadow-2xs"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] font-medium text-sm transition-colors shadow-2xs cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
