import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { HymnList } from '../components/HymnList';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useApp();

  const favoriteHymns = useMemo(() => {
    return hymnService.getHymnsByIds(favorites);
  }, [favorites]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-widest mb-1">
            <Heart size={14} className="fill-current" />
            <span>Saved Collection</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Your Favorite Hymns
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Hymns you have bookmarked for easy access during service and personal prayer.
          </p>
        </div>

        {favoriteHymns.length > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] self-start sm:self-center">
            {favoriteHymns.length} {favoriteHymns.length === 1 ? 'hymn' : 'hymns'} saved
          </span>
        )}
      </div>

      {/* List or Empty State */}
      {favoriteHymns.length > 0 ? (
        <HymnList hymns={favoriteHymns} />
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorite hymns yet"
          description="Tap the heart icon beside any hymn in the collection to save it here for fast retrieval."
          actionLabel="Browse All Hymns"
          actionTo="/hymns"
        />
      )}
    </div>
  );
};
