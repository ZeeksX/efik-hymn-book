import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Presentation } from 'lucide-react';
import { HymnReader } from '../features/hymns/HymnReader';
import { ReaderToolbar } from '../features/hymns/ReaderToolbar';
import { PreviousNextNavigation } from '../components/PreviousNextNavigation';
import { EmptyState } from '../components/EmptyState';
import { hymnService } from '../services/hymnService';
import { useApp } from '../context/AppContext';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

export const HymnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addRecentlyViewed } = useApp();

  const hymn = useMemo(() => {
    if (!id) return undefined;
    return hymnService.getHymnById(id) || hymnService.getHymnByNumber(parseInt(id, 10));
  }, [id]);

  // Track recently viewed
  useEffect(() => {
    if (hymn) {
      addRecentlyViewed(hymn.id);
      // Update page title
      document.title = `Hymn ${hymn.number}: ${hymn.title} | Efik Hymn Book`;
    }
  }, [hymn, addRecentlyViewed]);

  // Adjacent hymns for prev/next navigation
  const { prev, next } = useMemo(() => {
    if (!hymn) return { prev: null, next: null };
    return hymnService.getAdjacentHymns(hymn.number);
  }, [hymn]);

  // Keyboard navigation
  useKeyboardNav({
    onPrevious: () => {
      if (prev) navigate(`/hymns/${prev.id}`);
    },
    onNext: () => {
      if (next) navigate(`/hymns/${next.id}`);
    },
    enabled: Boolean(hymn),
  });

  if (!hymn) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Hymn Not Found"
        description={`We could not find a hymn with identifier "${id}". It may not exist in this edition.`}
        actionLabel="Browse all hymns"
        actionTo="/hymns"
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/hymns"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>All Hymns</span>
        </Link>

        {/* Quick present link on top */}
        <Link
          to={`/hymns/${hymn.id}/present`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-gold)] hover:underline"
        >
          <Presentation size={14} />
          <span>Presentation Mode</span>
        </Link>
      </div>

      {/* Reader Toolbar (Controls for text size, copy, share, dark mode) */}
      <ReaderToolbar hymn={hymn} />

      {/* The Reading Page (Book Experience) */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-10 shadow-xs">
        <HymnReader hymn={hymn} />

        {/* Bottom Previous / Next Hymn Controls */}
        <PreviousNextNavigation prevHymn={prev} nextHymn={next} />
      </div>
    </div>
  );
};
