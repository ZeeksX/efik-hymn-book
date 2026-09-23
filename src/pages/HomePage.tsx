import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, LayoutGrid } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { HymnList } from '../components/HymnList';
import { hymnService } from '../services/hymnService';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { openGoToHymn, recentlyViewed } = useApp();

  const recentHymns = useMemo(
    () => hymnService.getHymnsByIds(recentlyViewed).slice(0, 4),
    [recentlyViewed]
  );
  const featuredHymns = useMemo(() => hymnService.getFeaturedHymns().slice(0, 4), []);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
      {/* Brand hero — deep blue gradient, white text, gold accents */}
      <section
        className="relative overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pt-12 pb-14 sm:pt-16 sm:pb-16 text-center bg-[image:var(--gradient-brand)]"
        aria-labelledby="hero-heading"
      >
        {/* Subtle gold rule accents — decorative only */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 w-24 h-[3px] rounded-full bg-gold/70"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/[0.04]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-gold/[0.06]"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Organization line */}
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-white/70 mb-4">
            The Apostolic Church Nigeria · Great-Ilasa District
          </p>

          <h1 id="hero-heading" className="text-display text-white">
            Rehoboth <span className="text-gold">Assembly</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-white/85">
            Hymns for worship, wherever you are.
          </p>
          <p className="mt-1 text-sm text-white/60">Ñwed Ikwọ Efik — the Efik hymn collection</p>

          {/* Prominent search on dark surface */}
          <div className="mt-7 max-w-2xl mx-auto [&_input]:bg-white [&_input]:border-transparent [&_input]:text-[#0a1f3d] [&_input]:placeholder:text-[#7b8ba1]">
            <SearchBar
              size="large"
              value={query}
              onSearchChange={setQuery}
              onSubmit={handleSearch}
              showGoToShortcut={false}
            />
          </div>

          {/* Primary actions — gold CTA + white outline secondary */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/hymns')}
              className="inline-flex items-center justify-center h-11 px-6 rounded-[10px] bg-gold text-on-gold hover:bg-gold-strong text-sm font-semibold transition-colors focus-ring shadow-xs"
            >
              Browse Hymns
            </button>
            <button
              type="button"
              onClick={openGoToHymn}
              className="inline-flex items-center justify-center h-11 px-6 rounded-[10px] border border-white/45 text-white hover:bg-white/10 text-sm font-semibold transition-colors focus-ring"
            >
              Go to Hymn
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentHymns.length > 0 && (
        <section aria-labelledby="recent-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="recent-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock size={15} className="text-subtle-foreground" />
              Recently Viewed
            </h2>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring rounded-sm"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <HymnList hymns={recentHymns} />
        </section>
      )}

      {/* Browse by Category */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="categories-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutGrid size={15} className="text-subtle-foreground" />
            Browse by Category
          </h2>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring rounded-sm"
          >
            All categories <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group flex items-center justify-between gap-2 px-4 py-3.5 rounded-[12px] border border-border bg-surface hover:border-primary-soft-border hover:bg-surface-secondary transition-colors focus-ring"
            >
              <span className="font-serif font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {cat.name}
              </span>
              <span className="text-[11px] font-semibold text-subtle-foreground shrink-0 tabular-nums">
                {cat.hymnCount}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured hymns */}
      <section aria-labelledby="featured-heading" className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 id="featured-heading" className="text-sm font-semibold text-foreground">
            Well-loved Hymns
          </h2>
          <Link
            to="/hymns"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring rounded-sm"
          >
            Browse all <ArrowRight size={13} />
          </Link>
        </div>
        <HymnList hymns={featuredHymns} />
      </section>
    </div>
  );
};
