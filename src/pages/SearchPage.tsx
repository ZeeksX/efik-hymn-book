import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, History, X, Clock } from 'lucide-react';
import { searchService } from '../services/searchService';
import type { SearchMatch } from '../services/searchService';
import { useApp } from '../context/AppContext';
import { HymnList } from '../components/HymnList';
import { EmptyState } from '../components/ui';

type SearchTab = 'all' | 'titles' | 'lyrics' | 'categories';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const activeTab = (searchParams.get('type') as SearchTab) || 'all';
  const [inputValue, setInputValue] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  const [displayLimit, setDisplayLimit] = useState(15);

  const { addRecentSearch, recentSearches, clearRecentSearches } = useApp();

  // Sync the input when the URL changes (back/forward navigation) —
  // render-phase adjustment, the React-recommended alternative to an effect.
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setInputValue(urlQuery);
  }

  const setParams = (q: string, type: SearchTab) => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (type !== 'all') next.set('type', type);
    setSearchParams(next);
  };

  const allMatches: SearchMatch[] = useMemo(() => {
    if (!urlQuery.trim()) return [];
    return searchService.search(urlQuery);
  }, [urlQuery]);

  // Exact number match jumps to the top naturally via score; surface it if present
  const numberMatch = useMemo(
    () => allMatches.find((m) => m.matchField === 'number' && m.score >= 1000),
    [allMatches]
  );

  const titleMatches = useMemo(
    () =>
      allMatches.filter(
        (m) =>
          m.matchField === 'exact-title' ||
          m.matchField === 'title-prefix' ||
          m.matchField === 'title'
      ),
    [allMatches]
  );

  const lyricMatches = useMemo(() => allMatches.filter((m) => m.matchField === 'lyrics'), [allMatches]);

  const categoryMatches = useMemo(
    () => allMatches.filter((m) => m.matchField === 'category' || m.matchField === 'tag'),
    [allMatches]
  );

  const currentTabMatches = useMemo(() => {
    if (activeTab === 'titles') return titleMatches;
    if (activeTab === 'lyrics') return lyricMatches;
    if (activeTab === 'categories') return categoryMatches;
    return allMatches;
  }, [activeTab, allMatches, titleMatches, lyricMatches, categoryMatches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setParams(trimmed, activeTab);
    if (trimmed) addRecentSearch(trimmed);
    setDisplayLimit(15);
  };

  const snippetById = useMemo(() => {
    const map: Record<string, string> = {};
    currentTabMatches.forEach((m) => {
      if (m.matchedSnippet) map[m.hymn.id] = m.matchedSnippet;
    });
    return map;
  }, [currentTabMatches]);

  const visibleMatches = currentTabMatches.slice(0, displayLimit);

  const tabBtn = (tab: SearchTab, label: string, count: number) => (
    <button
      key={tab}
      type="button"
      onClick={() => setParams(urlQuery, tab)}
      aria-pressed={activeTab === tab}
      className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors focus-ring ${
        activeTab === tab
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-surface text-muted-foreground border-border hover:text-foreground hover:border-border-strong'
      }`}
    >
      {label} <span className="opacity-70 tabular-nums">({count})</span>
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header + prominent search */}
      <div>
        <h1 className="text-h1 text-foreground">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find hymns by number, title, lyrics or category.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2" role="search">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search number, title or lyrics..."
            aria-label="Search hymns"
            className="w-full h-11 pl-10 pr-10 rounded-[12px] border border-border bg-surface text-foreground placeholder:text-subtle-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setParams('', activeTab);
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-subtle-foreground hover:text-foreground transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      {/* Recent searches — only when no active query */}
      {!urlQuery && recentSearches.length > 0 && (
        <section aria-labelledby="recent-searches">
          <div className="flex items-center justify-between mb-2.5">
            <h2 id="recent-searches" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock size={14} className="text-subtle-foreground" />
              Recent Searches
            </h2>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs text-muted-foreground hover:text-danger transition-colors focus-ring rounded-sm"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setInputValue(q);
                  setParams(q, 'all');
                }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors focus-ring"
              >
                <History size={12} />
                {q}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Filter tabs + result count */}
      {urlQuery && (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {tabBtn('all', 'All', allMatches.length)}
              {tabBtn('titles', 'Titles', titleMatches.length)}
              {tabBtn('lyrics', 'Lyrics', lyricMatches.length)}
              {tabBtn('categories', 'Categories', categoryMatches.length)}
            </div>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              <strong className="text-foreground tabular-nums">{currentTabMatches.length}</strong>{' '}
              result{currentTabMatches.length === 1 ? '' : 's'} for “{urlQuery}”
            </p>
          </div>

          {/* Direct hymn-number hit gets a fast jump affordance */}
          {numberMatch && activeTab === 'all' && (
            <Link
              to={`/hymns/${numberMatch.hymn.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] bg-primary-soft border border-primary-soft-border group focus-ring"
            >
              <span className="text-sm">
                <span className="font-mono font-bold text-primary">Hymn {numberMatch.hymn.number}</span>
                <span className="text-foreground font-serif font-semibold"> · {numberMatch.hymn.title}</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary/70">Open →</span>
            </Link>
          )}

          {/* Results */}
          <HymnList
            hymns={visibleMatches.map((m) => m.hymn)}
            matchedSnippetById={snippetById}
            emptyTitle="No hymns found"
            emptyDescription={`No hymns match "${urlQuery}" under this filter. Try a different term or the All tab.`}
          />

          {currentTabMatches.length > displayLimit && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 15)}
                className="inline-flex items-center h-9 px-4 rounded-[10px] border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-secondary transition-colors focus-ring"
              >
                Show more results
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty prompt state when nothing searched yet */}
      {!urlQuery && recentSearches.length === 0 && (
        <EmptyState
          icon={Search}
          title="Search the hymnal"
          description="Type a hymn number, a title, or a line of lyrics above. Exact hymn numbers open instantly."
          actionLabel="Browse all hymns"
          actionTo="/hymns"
          compact
        />
      )}
    </div>
  );
};
