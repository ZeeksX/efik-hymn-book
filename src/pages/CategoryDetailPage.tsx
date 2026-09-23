import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Grid, BookOpen } from 'lucide-react';
import { HymnList } from '../components/HymnList';
import { EmptyState } from '../components/EmptyState';
import { hymnService } from '../services/hymnService';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const category = useMemo(() => {
    if (!slug) return undefined;
    return hymnService.getCategoryBySlug(slug);
  }, [slug]);

  const hymns = useMemo(() => {
    if (!category) return [];
    return hymnService.getHymnsByCategory(category.name);
  }, [category]);

  if (!category) {
    return (
      <EmptyState
        icon={Grid}
        title="Category Not Found"
        description={`We could not locate a hymn category corresponding to "${slug}".`}
        actionLabel="View all categories"
        actionTo="/categories"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Category Hero / Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
          <BookOpen size={14} />
          <span>Category</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {category.name}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
          {category.description}
        </p>
        <div className="pt-2">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
            {hymns.length} {hymns.length === 1 ? 'hymn' : 'hymns'} available
          </span>
        </div>
      </div>

      {/* Hymns in this category */}
      <div>
        <h2 className="font-serif text-lg font-bold text-[var(--text-primary)] mb-3">
          Hymns in this category
        </h2>
        <HymnList
          hymns={hymns}
          emptyTitle="No hymns in this category"
          emptyDescription="There are currently no hymns recorded under this specific category."
          emptyActionLabel="Browse All Hymns"
          onEmptyAction={() => {}}
        />
      </div>
    </div>
  );
};
