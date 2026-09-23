import React from 'react';
import { formatHymnNumber } from '../utils/formatters';

interface HymnNumberProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const HymnNumber: React.FC<HymnNumberProps> = ({
  number,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-sm px-2.5 py-1 tracking-widest font-semibold',
    lg: 'text-base px-3 py-1.5 tracking-widest font-bold',
    hero: 'text-xl sm:text-2xl px-4 py-2 tracking-widest font-bold',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-mono rounded-md border border-[var(--border-strong)]/40 bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] dark:text-[var(--accent-gold)] shadow-xs select-none ${sizeStyles[size]} ${className}`}
      aria-label={`Hymn number ${number}`}
    >
      {formatHymnNumber(number)}
    </span>
  );
};
