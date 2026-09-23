import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { hymnService } from '../services/hymnService';
import { CATEGORIES, getCategoryBadgeClasses } from '../data/categories';
import { useApp } from '../context/AppContext';
import { normalizeEfikText } from '../utils/formatters';

const ITEMS_PER_PAGE = 10;

export const HymnsPage: React.FC = () => {
  const allHymns = useMemo(() => hymnService.getAllHymns(), []);
  const { isFavorite, toggleFavorite } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'num-asc' | 'num-desc' | 'title-asc'>('num-asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Total hymn count representation matching the 350 edition in the mockup
  const totalHymnCount = 350;

  // Filtered hymns
  const filteredHymns = useMemo(() => {
    return allHymns.filter((hymn) => {
      // Search
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

      // Category
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj && !hymn.category.toLowerCase().includes(catObj.name.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'num-desc') {
        return b.number - a.number;
      }
      return a.number - b.number;
    });
  }, [allHymns, searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredHymns.length / ITEMS_PER_PAGE));
  const currentHymns = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHymns.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHymns, currentPage]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Hymns
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Browse and explore all hymns. Use the search or filters to find what you're looking for.
        </p>
      </div>

      {/* Main 2-Column Layout matching Screen 2 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Categories Sidebar (md:col-span-3 or 4) */}
        <aside className="md:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif font-bold text-sm text-[var(--text-primary)]">
              Categories
            </h2>
          </div>

          <div className="space-y-1 bg-[var(--bg-surface)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-xs">
            {/* All Hymns item */}
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#EBF7EE] text-[var(--brand-primary)] font-bold dark:bg-[#1C2E22]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>All Hymns</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-main)] text-[var(--text-secondary)] font-semibold">
                {totalHymnCount}
              </span>
            </button>

            {/* Category list items */}
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF7EE] text-[var(--brand-primary)] font-bold dark:bg-[#1C2E22]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-main)] text-[var(--text-secondary)] font-semibold">
                    {cat.hymnCount || 10}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Toolbar, Hymns Table, and Pagination (md:col-span-9) */}
        <main className="md:col-span-9 space-y-4">
          {/* Top Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search hymns..."
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>

            {/* Filter Button & Sort Dropdown */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  // Toggle quick category focus or clear
                  if (selectedCategory !== 'all') {
                    setSelectedCategory('all');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
              </button>

              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'num-asc' | 'num-desc' | 'title-asc')}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-2 text-xs font-semibold text-[var(--text-primary)] focus:outline-hidden cursor-pointer"
                >
                  <option value="num-asc">Number (Asc)</option>
                  <option value="num-desc">Number (Desc)</option>
                  <option value="title-asc">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hymns Table / Structured Rows */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xs">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/50 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              <div className="col-span-2 sm:col-span-1 text-center">#</div>
              <div className="col-span-6 sm:col-span-7">Title</div>
              <div className="col-span-3 text-left">Category</div>
              <div className="col-span-1 text-right"></div>
            </div>

            {/* Table Rows */}
            {currentHymns.length > 0 ? (
              <div className="divide-y divide-[var(--border-subtle)]">
                {currentHymns.map((hymn) => {
                  const favorited = isFavorite(hymn.id);
                  return (
                    <div
                      key={hymn.id}
                      onClick={() => navigate(`/hymns/${hymn.id}`)}
                      className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-3.5 items-center hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer group"
                    >
                      {/* Hymn Number */}
                      <div className="col-span-2 sm:col-span-1 text-xs font-bold text-[var(--text-secondary)] text-center group-hover:text-[var(--brand-primary)]">
                        {hymn.number}
                      </div>

                      {/* Title & Alternate */}
                      <div className="col-span-6 sm:col-span-7">
                        <p className="font-serif font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                          {hymn.title}
                        </p>
                        {hymn.alternateTitle && (
                          <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                            {hymn.alternateTitle}
                          </p>
                        )}
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

                      {/* Heart Favorite Toggle */}
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
                            className={
                              favorited
                                ? 'fill-red-500 text-red-500'
                                : 'hover:text-red-500'
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
                No hymns matched your search criteria.
              </div>
            )}
          </div>

          {/* Pagination Footer matching Screen 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[var(--text-secondary)]">
            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === p
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                  }`}
                >
                  {p}
                </button>
              ))}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-[var(--text-tertiary)]">...</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === totalPages
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Showing Count Indicator */}
            <div>
              Showing{' '}
              <strong className="text-[var(--text-primary)]">
                {filteredHymns.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredHymns.length)}
              </strong>{' '}
              of {filteredHymns.length} hymns
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
