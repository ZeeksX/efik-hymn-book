import React, { useState, useMemo } from 'react';
import { BookOpen, ArrowUpDown, Filter, X } from 'lucide-react';
import { HymnListItem } from '../components/HymnListItem';
import { EmptyState } from '../components/EmptyState';
import { hymnService } from '../services/hymnService';
import { normalizeEfikText } from '../utils/formatters';

export const HymnsPage: React.FC = () => {
  const allHymns = useMemo(() => hymnService.getAllHymns(), []);
  const categories = useMemo(() => hymnService.getCategories(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'number' | 'alphabetical'>('number');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Alphabet letters list for hymn book index
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filtered and sorted hymns
  const filteredHymns = useMemo(() => {
    return allHymns.filter((hymn) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const normQ = normalizeEfikText(searchQuery);
        const matchNumber = String(hymn.number).includes(searchQuery.trim());
        const matchTitle = normalizeEfikText(hymn.title).includes(normQ);
        const matchAlt = hymn.alternateTitle
          ? normalizeEfikText(hymn.alternateTitle).includes(normQ)
          : false;
        const matchCategory = normalizeEfikText(hymn.category).includes(normQ);
        const matchLyrics = hymn.verses.some((v) =>
          v.lines.some((l) => normalizeEfikText(l).includes(normQ))
        );

        if (!matchNumber && !matchTitle && !matchAlt && !matchCategory && !matchLyrics) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        if (catObj && !hymn.category.toLowerCase().includes(catObj.name.toLowerCase())) {
          return false;
        }
      }

      // 3. Alphabet letter filter
      if (selectedLetter) {
        const firstChar = hymn.title.trim().charAt(0).toUpperCase();
        if (firstChar !== selectedLetter) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return a.number - b.number;
    });
  }, [allHymns, searchQuery, selectedCategory, sortBy, selectedLetter, categories]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLetter(null);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedLetter !== null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <BookOpen size={14} />
          <span>The Complete Collection</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          All Hymns
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Browse and search the entire collection of {allHymns.length} Efik hymns.
        </p>
      </div>

      {/* Control Bar: Search Input, Category Filter, Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {/* Inline Search Input */}
        <div className="relative flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, lyrics, or hymn #..."
            className="w-full text-sm py-2 px-3 pl-3 pr-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort and Category Filters */}
        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">
            <Filter size={14} className="text-[var(--text-tertiary)]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              className="bg-transparent text-[var(--text-primary)] font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">
            <ArrowUpDown size={14} className="text-[var(--text-tertiary)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'number' | 'alphabetical')}
              aria-label="Sort hymns by"
              className="bg-transparent text-[var(--text-primary)] font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="number">By Hymn Number</option>
              <option value="alphabetical">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alphabetical Quick Bar (Hymn-book style index) */}
      <div className="overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          <button
            type="button"
            onClick={() => setSelectedLetter(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              selectedLetter === null
                ? 'bg-[var(--brand-primary)] text-white'
                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => {
            const hasHymnsWithLetter = allHymns.some(
              (h) => h.title.trim().charAt(0).toUpperCase() === letter
            );
            const isSelected = selectedLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                disabled={!hasHymnsWithLetter}
                onClick={() => setSelectedLetter(isSelected ? null : letter)}
                className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--brand-primary)] text-white font-bold'
                    : hasHymnsWithLetter
                    ? 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    : 'opacity-30 text-[var(--text-tertiary)] cursor-not-allowed border border-[var(--border-subtle)]/40'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
        <span>
          Showing <strong className="text-[var(--text-primary)]">{filteredHymns.length}</strong> of {allHymns.length} hymns
          {selectedLetter && ` starting with "${selectedLetter}"`}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[var(--brand-primary)] hover:underline font-semibold cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Hymns List */}
      {filteredHymns.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {filteredHymns.map((hymn) => (
            <HymnListItem key={hymn.id} hymn={hymn} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No hymns matched your filters"
          description="Try clearing your search term, changing the category, or selecting another letter."
          actionLabel="Clear all filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
};
