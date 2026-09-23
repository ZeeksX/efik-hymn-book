import React from 'react';
import { BookOpen } from 'lucide-react';
import type { Hymn } from '../types/hymn';
import { HymnListItem } from './HymnListItem';
import { EmptyState } from './ui';

interface HymnListProps {
  hymns: Hymn[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionTo?: string;
  matchedSnippetById?: Record<string, string>;
  className?: string;
}

export const HymnList: React.FC<HymnListProps> = ({
  hymns,
  emptyTitle = 'No hymns found',
  emptyDescription = 'There are no hymns matching your current criteria.',
  emptyActionLabel,
  emptyActionTo,
  matchedSnippetById,
  className = '',
}) => {
  if (hymns.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionTo={emptyActionTo}
        compact
      />
    );
  }

  return (
    <div
      className={`rounded-[14px] border border-border bg-surface divide-y divide-border overflow-hidden ${className}`}
    >
      {hymns.map((hymn) => (
        <HymnListItem
          key={hymn.id}
          hymn={hymn}
          matchedSnippet={matchedSnippetById?.[hymn.id]}
        />
      ))}
    </div>
  );
};
