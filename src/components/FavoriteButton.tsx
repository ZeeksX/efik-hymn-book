import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from './ui';

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
  const { toast } = useToast();
  const active = isFavorite(hymnId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowActive = !active;
    toggleFavorite(hymnId);
    toast(nowActive ? 'Added to Favourites' : 'Removed from Favourites', nowActive ? 'success' : 'info');
  };

  const iconSizes = { sm: 15, md: 17, lg: 20 };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from Favourites' : 'Add to Favourites'}
      aria-pressed={active}
      title={active ? 'Remove from Favourites' : 'Add to Favourites'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-colors duration-150 focus-ring ${
        showLabel
          ? 'px-3 h-9 text-sm font-medium border border-border bg-surface hover:border-border-strong'
          : 'p-2'
      } ${
        active
          ? 'text-danger'
          : 'text-subtle-foreground hover:text-foreground'
      } ${className}`}
    >
      <Heart size={iconSizes[size]} className={active ? 'fill-current' : ''} />
      {showLabel && <span>{active ? 'Saved' : 'Save'}</span>}
    </button>
  );
};
