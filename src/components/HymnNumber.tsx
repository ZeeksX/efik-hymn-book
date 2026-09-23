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
    sm: 'text-[11px] px-1.5 py-0.5 min-w-[34px]',
    md: 'text-sm px-2 py-1 min-w-[44px]',
    lg: 'text-base px-2.5 py-1 min-w-[52px]',
    hero: 'text-2xl sm:text-3xl px-3.5 py-1.5 tracking-widest',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold rounded-md border border-border bg-surface-secondary text-accent select-none tabular-nums ${sizeStyles[size]} ${className}`}
      aria-label={`Hymn number ${number}`}
    >
      {formatHymnNumber(number)}
    </span>
  );
};
