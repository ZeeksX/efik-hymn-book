import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function getPageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push('ellipsis');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const btnBase =
    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors focus-ring';

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${btnBase} border border-border bg-surface hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none`}
      >
        <ChevronLeft size={14} />
      </button>

      {getPageWindow(page, totalPages).map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`e-${idx}`} className="px-1 text-subtle-foreground text-xs" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={page === p ? 'page' : undefined}
            className={`${btnBase} ${
              page === p
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-surface hover:bg-surface-secondary text-foreground'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${btnBase} border border-border bg-surface hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none`}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
};
