import React from 'react';
import { Link } from 'react-router-dom';
import type { Hymn } from '../types/hymn';
import { HymnNumber } from './HymnNumber';
import { FavoriteButton } from './FavoriteButton';

interface HymnListItemProps {
  hymn: Hymn;
  matchedSnippet?: string;
  className?: string;
}

export const HymnListItem: React.FC<HymnListItemProps> = ({
  hymn,
  matchedSnippet,
  className = '',
}) => {
  const firstLine = hymn.verses[0]?.lines[0] || '';

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--brand-primary)]/40 transition-all duration-150 shadow-2xs hover:shadow-xs ${className}`}
    >
      <Link
        to={`/hymns/${hymn.id}`}
        className="flex items-start sm:items-center gap-3.5 sm:gap-4.5 flex-1 min-w-0"
      >
        {/* Prominent Hymn Number */}
        <div className="shrink-0 pt-0.5 sm:pt-0">
          <HymnNumber number={hymn.number} size="md" />
        </div>

        {/* Hymn Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">
              {hymn.title}
            </h3>
            {hymn.alternateTitle && (
              <span className="hidden md:inline-block text-xs text-[var(--text-tertiary)] italic truncate max-w-[200px]">
                ({hymn.alternateTitle})
              </span>
            )}
          </div>

          {/* First Line of Lyric or Matched Snippet */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate mt-0.5">
            {matchedSnippet ? (
              <span className="text-[var(--brand-primary)] font-medium">
                {matchedSnippet}
              </span>
            ) : (
              firstLine
            )}
          </p>

          {/* Metadata badges: Category, Key, Meter */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[var(--text-tertiary)]">
            <span className="inline-block px-2 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] font-medium">
              {hymn.category}
            </span>
            {hymn.tune && (
              <span className="hidden sm:inline-block">
                Tune: <span className="italic">{hymn.tune}</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <div className="shrink-0 flex items-center">
        <FavoriteButton hymnId={hymn.id} size="md" />
      </div>
    </div>
  );
};
