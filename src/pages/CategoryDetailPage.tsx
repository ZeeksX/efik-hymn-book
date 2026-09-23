import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { HymnList } from '../components/HymnList';
import { EmptyState, Select } from '../components/ui';
import { SearchBar } from '../components/SearchBar';
import { hymnService } from '../services/hymnService';
import { normalizeEfikText } from '../utils/formatters';

const SORTS = [
  { value: 'num-asc', label: 'Number (ascending)' },
  { value: 'num-desc', label: 'Number (descending)' },
  { value: 'title-asc', label: 'Title (A–Z)' },
];

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('num-asc');

  const category = useMemo(() => {
    if (!slug) return undefined;
    return hymnService.getCategoryBySlug(slug);
  }, [slug]);

  const hymns = useMemo(() => {
    if (!category) return [];
    const normQuery = normalizeEfikText(search);
    return hymnService
      .getHymnsByCategory(category.name)
      .filter((h) => {
        if (!search.trim()) return true;
        return (
          String(h.number).includes(search.trim()) ||
          normalizeEfikText(h.title).includes(normQuery) ||
          h.verses.some((v) => v.lines.some((l) => normalizeEfikText(l).includes(normQuery)))
        );
      })
      .sort((a, b) => {
        if (sort === 'title-asc') return a.title.localeCompare(b.title);
        if (sort === 'num-desc') return b.number - a.number;
        return a.number - b.number;
      });
  }, [category, search, sort]);

  if (!category) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="Category not found"
        description={`We could not locate a hymn category for "${slug}".`}
        actionLabel="View all categories"
        actionTo="/categories"
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md"
        >
          <ArrowLeft size={16} />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Category header — typography, not a hero card */}
      <header>
        <h1 className="text-h1 text-foreground">{category.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <strong className="text-foreground tabular-nums">{hymns.length}</strong>{' '}
          {hymns.length === 1 ? 'hymn' : 'hymns'}
          {category.description ? ` · ${category.description}` : ''}
        </p>
      </header>

      {/* In-category controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onSearchChange={setSearch}
            placeholder={`Search in ${category.name}...`}
            showGoToShortcut={false}
          />
        </div>
        <Select
          aria-label="Sort hymns in category"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={SORTS}
          className="sm:w-44"
        />
      </div>

      {/* Same standard hymn list as /hymns — consistency is mandatory */}
      <HymnList
        hymns={hymns}
        emptyTitle="No hymns in this category"
        emptyDescription="There are currently no hymns recorded under this category."
        emptyActionLabel="Browse All Hymns"
        emptyActionTo="/hymns"
      />
    </div>
  );
};
