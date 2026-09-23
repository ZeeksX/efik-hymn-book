import React from 'react';
import type { Hymn } from '../types/hymn';
import { HymnListItem } from './HymnListItem';
import { EmptyState } from './EmptyState';
import { BookOpen } from 'lucide-react';

interface HymnListProps {
  hymns: Hymn[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
}

export const HymnList: React.FC<HymnListProps> = ({
  hymns,
  emptyTitle = 'No hymns found',
  emptyDescription = 'There are no hymns matching your current criteria.',
  emptyActionLabel,
  onEmptyAction,
  className = '',
}) => {
  if (hymns.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={`flex flex-col gap-2.5 sm:gap-3 ${className}`}>
      {hymns.map((hymn) => (
        <HymnListItem key={hymn.id} hymn={hymn} />
      ))}
    </div>
  );
};
