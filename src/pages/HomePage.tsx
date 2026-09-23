import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Clock, LayoutGrid } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { HymnList } from '../components/HymnList';
import { Button } from '../components/ui';
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
      {/* Compact editorial hero */}
      <section className="pt-2 sm:pt-6 max-w-3xl mx-auto text-center">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-3">
          Ñwed Ikwọ Efik
        </p>
        <h1 className="text-display text-foreground">Efik Hymn Book</h1>
        <p className="mt-2.5 text-base sm:text-lg text-muted-foreground">
          Hymns for worship, wherever you are.
        </p>

        {/* Prominent search */}
        <div className="mt-6 max-w-2xl mx-auto">
          <SearchBar
            size="large"
            value={query}
            onSearchChange={setQuery}
            onSubmit={handleSearch}
            showGoToShortcut={false}
          />
        </div>

        {/* Primary actions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate('/hymns')}
            className="min-w-[150px]"
          >
            Browse Hymns
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={openGoToHymn}
            className="min-w-[150px]"
          >
            Go to Hymn
          </Button>
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
