import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MoreHorizontal, Copy, Share2, Trash2, Check, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';
import { EmptyState } from '../components/EmptyState';

export const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // If user has no favorites yet, provide mockup starter favorites
  const activeFavorites = favorites.length > 0 ? favorites : ['5', '12', '42', '87', '102'];
  const favoriteHymns = hymnService.getHymnsByIds(activeFavorites);

  const handleCopy = (e: React.MouseEvent, hymnId: string) => {
    e.stopPropagation();
    const hymn = hymnService.getHymnById(hymnId);
    if (!hymn) return;
    const text = `Hymn ${hymn.number}: ${hymn.title}\n${window.location.origin}/hymns/${hymn.id}`;
    navigator.clipboard.writeText(text);
    setCopiedId(hymnId);
    setTimeout(() => {
      setCopiedId(null);
      setActiveMenuId(null);
    }, 1500);
  };

  const handleShare = async (e: React.MouseEvent, hymnId: string) => {
    e.stopPropagation();
    const hymn = hymnService.getHymnById(hymnId);
    if (!hymn) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hymn ${hymn.number}: ${hymn.title}`,
          url: `${window.location.origin}/hymns/${hymn.id}`,
        });
      } catch {
        // Dismissed
      }
    } else {
      handleCopy(e, hymnId);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      {/* Header matching Screen 6 */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          My Favourites
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Your saved hymns, always with you.
        </p>
      </div>

      {/* Favorites List matching Screen 6 */}
      {favoriteHymns.length > 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
          {favoriteHymns.map((hymn) => {
            const isMenuOpen = activeMenuId === hymn.id;
            return (
              <div
                key={hymn.id}
                onClick={() => navigate(`/hymns/${hymn.id}`)}
                className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer group"
              >
                {/* Left: Number and Title */}
                <div className="flex items-center gap-5">
                  <span className="w-8 text-xs sm:text-sm font-bold text-[var(--text-secondary)] text-center group-hover:text-[var(--brand-primary)]">
                    {hymn.number}
                  </span>
                  <div>
                    <h2 className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {hymn.title}
                    </h2>
                    {hymn.alternateTitle && (
                      <p className="text-xs text-[var(--text-tertiary)] italic">
                        {hymn.alternateTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Red Heart and More options (...) */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Filled Red Heart */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(hymn.id)}
                    aria-label="Remove from favourites"
                    title="Remove from favourites"
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </button>

                  {/* More Options Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : hymn.id)}
                      aria-label="More options"
                      className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xl py-1.5 z-40 animate-in fade-in">
                        <button
                          type="button"
                          onClick={(e) => handleCopy(e, hymn.id)}
                          className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                        >
                          {copiedId === hymn.id ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                          <span>{copiedId === hymn.id ? 'Copied' : 'Copy link'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShare(e, hymn.id)}
                          className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                        >
                          <Share2 size={14} />
                          <span>Share hymn</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleFavorite(hymn.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer border-t border-[var(--border-subtle)] mt-1 pt-1"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No favourites yet"
          description="Browse hymns and tap the heart icon to save your cherished worship hymns here."
          actionLabel="Browse all hymns"
          actionTo="/hymns"
        />
      )}
    </div>
  );
};
