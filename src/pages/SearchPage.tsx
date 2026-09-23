import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, Heart, ArrowRight } from 'lucide-react';
import { searchService } from '../services/searchService';
import type { SearchMatch } from '../services/searchService';
import { useApp } from '../context/AppContext';
import { getCategoryBadgeClasses } from '../data/categories';
import { EmptyState } from '../components/EmptyState';

type SearchTab = 'all' | 'titles' | 'lyrics' | 'categories';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || 'Abasi';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [displayLimit, setDisplayLimit] = useState(10);

  const { isFavorite, toggleFavorite, addRecentSearch } = useApp();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  const allMatches: SearchMatch[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchService.search(query);
  }, [query]);

  // Tab categorization
  const titleMatches = useMemo(() => {
    const q = query.toLowerCase();
    return allMatches.filter(
      (m) =>
        m.hymn.title.toLowerCase().includes(q) ||
        (m.hymn.alternateTitle && m.hymn.alternateTitle.toLowerCase().includes(q))
    );
  }, [allMatches, query]);

  const lyricMatches = useMemo(() => {
    return allMatches.filter((m) => m.matchField === 'lyrics');
  }, [allMatches]);

  const categoryMatches = useMemo(() => {
    const q = query.toLowerCase();
    return allMatches.filter((m) => m.hymn.category.toLowerCase().includes(q));
  }, [allMatches, query]);

  const currentTabMatches = useMemo(() => {
    if (activeTab === 'titles') return titleMatches;
    if (activeTab === 'lyrics') return lyricMatches;
    if (activeTab === 'categories') return categoryMatches;
    return allMatches;
  }, [activeTab, allMatches, titleMatches, lyricMatches, categoryMatches]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      addRecentSearch(query.trim());
      setDisplayLimit(10);
    }
  };

  const visibleMatches = currentTabMatches.slice(0, displayLimit);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Search Bar Row matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {query.trim()
              ? `Showing results for "${query}"`
              : 'Enter a keyword, hymn number, or phrase to search.'}
          </p>
        </div>

        {/* Search Form on Right */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hymns..."
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tabs matching Screen 4: All, Titles, Lyrics, Categories */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
          }`}
        >
          All ({allMatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('titles')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'titles'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
          }`}
        >
          Titles ({titleMatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lyrics')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'lyrics'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
          }`}
        >
          Lyrics ({lyricMatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
          }`}
        >
          Categories ({categoryMatches.length})
        </button>
      </div>

      {/* Results List */}
      {visibleMatches.length > 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
          {visibleMatches.map(({ hymn, matchedSnippet }) => {
            const favorited = isFavorite(hymn.id);
            return (
              <div
                key={hymn.id}
                onClick={() => navigate(`/hymns/${hymn.id}`)}
                className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-4 items-center hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer group"
              >
                {/* Hymn Number */}
                <div className="col-span-2 sm:col-span-1 text-xs font-bold text-[var(--text-secondary)] text-center group-hover:text-[var(--brand-primary)]">
                  {hymn.number}
                </div>

                {/* Title & Snippet */}
                <div className="col-span-6 sm:col-span-7">
                  <p className="font-serif font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {hymn.title}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] italic truncate mt-0.5">
                    {matchedSnippet ? `... ${matchedSnippet} ...` : (hymn.alternateTitle || hymn.category)}
                  </p>
                </div>

                {/* Category Badge */}
                <div className="col-span-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${getCategoryBadgeClasses(
                      hymn.category
                    )}`}
                  >
                    {hymn.category.split('&')[0].trim()}
                  </span>
                </div>

                {/* Heart Action */}
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(hymn.id);
                    }}
                    aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart
                      size={16}
                      className={favorited ? 'fill-red-500 text-red-500' : ''}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No hymns matched "${query}" under this tab. Try searching with different terms or selecting the All tab.`}
          actionLabel="Browse all hymns"
          actionTo="/hymns"
        />
      )}

      {/* Show more results link */}
      {currentTabMatches.length > displayLimit && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setDisplayLimit((prev) => prev + 10)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
          >
            <span>Show more results</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
