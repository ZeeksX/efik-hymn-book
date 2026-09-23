import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { hymnService } from '../services/hymnService';

export const CategoriesPage: React.FC = () => {
  const categories = hymnService.getCategories();

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header matching Screen 5 */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Categories
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Explore hymns by category
        </p>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* Link to browse all */}
      <div className="pt-4 text-center">
        <Link
          to="/hymns"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--brand-primary)] hover:underline"
        >
          <span>View all hymns</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
