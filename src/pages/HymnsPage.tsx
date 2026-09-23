import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CategoryChip } from '../components/CategoryChip';
import { HymnList } from '../components/HymnList';
import { Pagination, Select } from '../components/ui';
import { hymnService } from '../services/hymnService';
import { CATEGORIES } from '../data/categories';
import { normalizeEfikText } from '../utils/formatters';

const ITEMS_PER_PAGE = 15;

const SORTS = [
  { value: 'num-asc', label: 'Number (ascending)' },
  { value: 'num-desc', label: 'Number (descending)' },
  { value: 'title-asc', label: 'Title (A–Z)' },
];

export const HymnsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'num-asc';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'all' || (key === 'sort' && value === 'num-asc')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next, { replace: false });
  };

  const allHymns = useMemo(() => hymnService.getAllHymns(), []);

  const filteredHymns = useMemo(() => {
    const normQuery = normalizeEfikText(query);
    return allHymns
      .filter((hymn) => {
        if (query.trim()) {
          const matchNumber = String(hymn.number).includes(query.trim());
          const matchTitle = normalizeEfikText(hymn.title).includes(normQuery);
          const matchAlt = hymn.alternateTitle
            ? normalizeEfikText(hymn.alternateTitle).includes(normQuery)
            : false;
          const matchLyrics = hymn.verses.some((v) =>
            v.lines.some((l) => normalizeEfikText(l).includes(normQuery))
          );
          if (!matchNumber && !matchTitle && !matchAlt && !matchLyrics) return false;
        }

        if (category !== 'all') {
          const cat = CATEGORIES.find((c) => c.slug === category);
          if (cat && !hymn.category.toLowerCase().includes(cat.name.toLowerCase())) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === 'title-asc') return a.title.localeCompare(b.title);
        if (sort === 'num-desc') return b.number - a.number;
        return a.number - b.number;
      });
  }, [allHymns, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredHymns.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visibleHymns = useMemo(
    () => filteredHymns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredHymns, currentPage]
  );

  const isFiltered = Boolean(query.trim()) || category !== 'all';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-h1 text-foreground">All Hymns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the complete Efik hymn collection.
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={query}
              onSearchChange={(val) => setParam('q', val)}
              placeholder="Search hymns..."
              showGoToShortcut={false}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Select
              aria-label="Sort hymns"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              options={SORTS}
              className="w-44"
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex items-start gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground shrink-0">
            <SlidersHorizontal size={13} />
            Filter
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryChip
              label="All"
              active={category === 'all'}
              onClick={() => setParam('category', 'all')}
            />
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.name}
                active={category === cat.slug}
                onClick={() => setParam('category', cat.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {isFiltered ? (
          <>
            <strong className="text-foreground tabular-nums">{filteredHymns.length}</strong>{' '}
            {filteredHymns.length === 1 ? 'hymn' : 'hymns'} found
          </>
        ) : (
          <>
            <strong className="text-foreground tabular-nums">{allHymns.length}</strong> hymns in
            this edition
          </>
        )}
      </p>

      {/* List */}
      <HymnList
        hymns={visibleHymns}
        emptyTitle="No hymns found"
        emptyDescription="No hymns match your search or filters. Try a different term or clear the filters."
        emptyActionLabel="Clear filters"
        emptyActionTo="/hymns"
      />

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={(p) => {
            setParam('page', String(p));
            window.scrollTo({ top: 0 });
          }}
        />
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>
    </div>
  );
};
