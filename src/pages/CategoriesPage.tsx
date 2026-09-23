import React from 'react';
import { Grid } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { hymnService } from '../services/hymnService';

export const CategoriesPage: React.FC = () => {
  const categories = hymnService.getCategories();
  const totalHymns = hymnService.getAllHymns().length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <Grid size={14} />
          <span>Liturgical Index</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Hymn Categories
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Explore hymns organized by liturgical themes, church seasons, and devotional topics across {totalHymns} hymns.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
