import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';
import { HymnList } from '../components/HymnList';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useApp();

  const favoriteHymns = useMemo(() => hymnService.getHymnsByIds(favorites), [favorites]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-h1 text-foreground">My Favourites</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your saved hymns, always with you.</p>
      </div>

      {favoriteHymns.length > 0 ? (
        <HymnList hymns={favoriteHymns} />
      ) : (
        <HymnList
          hymns={[]}
          emptyTitle="No favourite hymns yet"
          emptyDescription="Tap the heart on any hymn to save it here."
          emptyActionLabel="Browse Hymns"
          emptyActionTo="/hymns"
        />
      )}
    </div>
  );
};
