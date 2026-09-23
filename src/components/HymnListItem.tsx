import React from 'react';
import { Link } from 'react-router-dom';
import type { Hymn } from '../types/hymn';
import { HymnNumber } from './HymnNumber';
import { FavoriteButton } from './FavoriteButton';
import { CategoryChip } from './CategoryChip';

interface HymnListItemProps {
  hymn: Hymn;
  matchedSnippet?: string;
  className?: string;
}

export const HymnListItem: React.FC<HymnListItemProps> = ({
  hymn,
  matchedSnippet,
}) => {
  const firstLine = hymn.verses[0]?.lines[0] || '';

  return (
    <div className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-surface-secondary transition-colors">
      <Link
        to={`/hymns/${hymn.id}`}
        className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 focus-ring rounded-md"
      >
        {/* Prominent hymn number */}
        <HymnNumber number={hymn.number} size="md" className="shrink-0" />

        {/* Title + first line / snippet */}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[15px] sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {hymn.title}
          </h3>
          <p className="text-xs sm:text-[13px] text-muted-foreground truncate mt-0.5">
            {matchedSnippet ? (
              <span className="text-primary font-medium">{matchedSnippet}</span>
            ) : (
              firstLine
            )}
          </p>
        </div>
      </Link>

      {/* Category (desktop only) + favourite */}
      <div className="shrink-0 flex items-center gap-1.5">
        <span className="hidden lg:inline-flex">
          <CategoryChip label={hymn.category.split('&')[0].trim()} to={`/categories`} />
        </span>
        <FavoriteButton hymnId={hymn.id} size="sm" />
      </div>
    </div>
  );
};
