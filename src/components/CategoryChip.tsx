import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryChipProps {
  label: string;
  to?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  to,
  active = false,
  onClick,
  className = '',
}) => {
  const classes = `inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors focus-ring ${
    active
      ? 'bg-primary-soft text-primary border-primary-soft-border'
      : 'bg-surface-secondary text-muted-foreground border-border hover:text-foreground hover:border-border-strong'
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${classes} cursor-pointer`} aria-pressed={active}>
      {label}
    </button>
  );
};
