import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryChipProps {
  label: string;
  slug?: string;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  slug,
  isActive = false,
  onClick,
  count,
  size = 'md',
  className = '',
}) => {
  const baseClasses = `inline-flex items-center gap-1.5 rounded-full font-medium transition-colors select-none ${
    size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-xs sm:text-sm'
  } ${
    isActive
      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
  } ${className}`;

  const content = (
    <>
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] sm:text-xs rounded-full px-1.5 py-0.2 ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-[var(--bg-surface-elevated)] text-[var(--text-tertiary)]'
          }`}
        >
          {count}
        </span>
      )}
    </>
  );

  if (slug && !onClick) {
    return (
      <Link to={`/categories/${slug}`} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} cursor-pointer`}>
      {content}
    </button>
  );
};
