import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Hash, Grid, Heart, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { HymnListItem } from '../components/HymnListItem';
import { CategoryChip } from '../components/CategoryChip';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';

export const HomePage: React.FC = () => {
  const { openGoToHymn, recentlyViewed, clearRecentlyViewed } = useApp();

  const featuredHymns = hymnService.getFeaturedHymns().slice(0, 6);
  const categories = hymnService.getCategories();
  const recentHymns = hymnService.getHymnsByIds(recentlyViewed).slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-12 max-w-4xl mx-auto">
      {/* Compact Welcoming Hero */}
      <section className="text-center pt-2 sm:pt-6 pb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] bg-[var(--accent-gold-light)] border border-[var(--accent-gold)]/20 mb-3">
          Ñwed Ikwọ Efik
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Which hymn do you want to sing?
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto">
          Search, read and sing your favourite Efik hymns during worship, choir rehearsals, and personal devotion.
        </p>

        {/* Dominant Search Bar */}
        <div className="mt-6 max-w-2xl mx-auto">
          <SearchBar size="large" />
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <button
            type="button"
            onClick={openGoToHymn}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Hash size={16} />
            <span>Go to Hymn Number</span>
          </button>
          <Link
            to="/hymns"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium transition-colors"
          >
            <BookOpen size={16} className="text-[var(--brand-primary)]" />
            <span>Browse All Hymns</span>
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium transition-colors"
          >
            <Grid size={16} className="text-[var(--accent-gold)]" />
            <span>Categories</span>
          </Link>
          <Link
            to="/favorites"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium transition-colors"
          >
            <Heart size={16} className="text-red-500" />
            <span>Favorites</span>
          </Link>
        </div>
      </section>

      {/* Recently Viewed Hymns (If user has history) */}
      {recentHymns.length > 0 && (
        <section aria-labelledby="recently-viewed-title">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--accent-gold)]" />
              <h2 id="recently-viewed-title" className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Recently Viewed
              </h2>
            </div>
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
            >
              Clear history
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recentHymns.map((hymn) => (
              <HymnListItem key={hymn.id} hymn={hymn} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section aria-labelledby="browse-categories-title">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid size={18} className="text-[var(--brand-primary)]" />
            <h2 id="browse-categories-title" className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--brand-primary)] hover:underline"
          >
            <span>All categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category chips grid */}
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 10).map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              slug={cat.slug}
              count={cat.count}
            />
          ))}
        </div>
      </section>

      {/* Featured / Popular Hymns */}
      <section aria-labelledby="featured-hymns-title">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--accent-gold)]" />
            <h2 id="featured-hymns-title" className="font-serif text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Featured Hymns
            </h2>
          </div>
          <Link
            to="/hymns"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--brand-primary)] hover:underline"
          >
            <span>View all hymns</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {featuredHymns.map((hymn) => (
            <HymnListItem key={hymn.id} hymn={hymn} />
          ))}
        </div>
      </section>
    </div>
  );
};
