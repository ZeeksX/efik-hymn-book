import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FavoriteButtonProps {
  hymnId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  hymnId,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(hymnId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(hymnId);
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${
        showLabel
          ? 'px-3 py-1.5 text-sm font-medium border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)]'
          : 'p-2 hover:bg-[var(--bg-surface-elevated)]'
      } ${
        active
          ? 'text-red-600 dark:text-red-400'
          : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
      } ${className}`}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-transform duration-200 ${
          active ? 'fill-current scale-110' : 'hover:scale-105'
        }`}
      />
      {showLabel && (
        <span className="text-xs sm:text-sm">
          {active ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};
