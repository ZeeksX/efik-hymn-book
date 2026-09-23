import React, { useMemo, useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';
import { HymnList } from '../components/HymnList';
import { Button, ConfirmDialog } from '../components/ui';

interface HymnGroup {
  label: string;
  hymnIds: string[];
}

export const HistoryPage: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const groups = useMemo<HymnGroup[]>(() => {
    // recentlyViewed is most-recent-first but carries no timestamps; split into
    // stable display groups by position (recent activity is front-loaded).
    if (recentlyViewed.length === 0) return [];
    return [
      { label: 'Today', hymnIds: recentlyViewed.slice(0, 4) },
      { label: 'Earlier', hymnIds: recentlyViewed.slice(4) },
    ].filter((g) => g.hymnIds.length > 0);
  }, [recentlyViewed]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-foreground">Recently Viewed</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hymns you have opened on this device.</p>
        </div>

        {recentlyViewed.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="text-muted-foreground hover:text-danger shrink-0"
          >
            <Trash2 size={14} />
            Clear History
          </Button>
        )}
      </div>

      {recentlyViewed.length > 0 ? (
        <div className="space-y-7">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`history-${group.label}`}>
              <h2
                id={`history-${group.label}`}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtle-foreground mb-2.5"
              >
                <Clock size={13} />
                {group.label}
              </h2>
              <HymnList hymns={hymnService.getHymnsByIds(group.hymnIds)} />
            </section>
          ))}
        </div>
      ) : (
        <HymnList
          hymns={[]}
          emptyTitle="No recently viewed hymns"
          emptyDescription="Hymns you open will appear here so you can find them again quickly."
          emptyActionLabel="Browse Hymns"
          emptyActionTo="/hymns"
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={clearRecentlyViewed}
        title="Clear Recently Viewed?"
        message="This removes your reading history from this device. Your favourites and settings are not affected."
        confirmLabel="Clear History"
        destructive
      />
    </div>
  );
};
