import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, History, X, Sparkles } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { HymnListItem } from '../components/HymnListItem';
import { EmptyState } from '../components/EmptyState';
import { searchService } from '../services/searchService';
import type { SearchMatch } from '../services/searchService';
import { useApp } from '../context/AppContext';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { recentSearches, clearRecentSearches, addRecentSearch } = useApp();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const searchResults: SearchMatch[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchService.search(query);
  }, [query]);

  const handleQuerySelect = (selected: string) => {
    setQuery(selected);
    setSearchParams({ q: selected });
    addRecentSearch(selected);
  };

  const handleSearchChange = (newVal: string) => {
    setQuery(newVal);
    if (newVal.trim()) {
      setSearchParams({ q: newVal }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Search Hymns
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Search across hymn numbers, Efik titles, verses, choruses, and categories.
        </p>
      </div>

      {/* Main Search Input */}
      <SearchBar
        initialValue={query}
        onSearchChange={handleSearchChange}
        autoFocus={!initialQuery}
        size="large"
      />

      {/* Recent Searches (Show when input is empty or has items) */}
      {!query.trim() && recentSearches.length > 0 && (
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            <div className="flex items-center gap-1.5">
              <History size={14} />
              <span>Recent Searches</span>
            </div>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuerySelect(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Search Hints / Suggestions if empty */}
      {!query.trim() && (
        <div className="p-5 rounded-2xl bg-[var(--brand-primary-light)]/40 border border-[var(--brand-primary)]/15 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Search Tips</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            • Enter a number like <strong className="text-[var(--text-primary)]">"42"</strong> or <strong className="text-[var(--text-primary)]">"128"</strong> to jump directly to a hymn.
            <br />
            • Type in Efik words like <strong className="text-[var(--text-primary)]">"Abasi"</strong>, <strong className="text-[var(--text-primary)]">"Jesus"</strong>, or English titles like <strong className="text-[var(--text-primary)]">"Holy, Holy"</strong>.
          </p>
        </div>
      )}

      {/* Search Results Display */}
      {query.trim() !== '' && (
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pb-3 px-1 border-b border-[var(--border-subtle)]">
            <span>
              Found <strong className="text-[var(--text-primary)]">{searchResults.length}</strong> {searchResults.length === 1 ? 'match' : 'matches'} for "{query}"
            </span>
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <X size={13} />
              <span>Clear search</span>
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-2.5 mt-4">
              {searchResults.map(({ hymn, matchedSnippet }) => (
                <HymnListItem
                  key={hymn.id}
                  hymn={hymn}
                  matchedSnippet={matchedSnippet}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No hymns found"
              description={`We couldn't find any hymn matching "${query}". Try searching by hymn number, title keyword, or specific lyric line.`}
              actionLabel="Browse all hymns"
              actionTo="/hymns"
            />
          )}
        </div>
      )}
    </div>
  );
};
