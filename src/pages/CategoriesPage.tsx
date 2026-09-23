import React from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { hymnService } from '../services/hymnService';

export const CategoriesPage: React.FC = () => {
  const categories = hymnService.getCategories();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-h1 text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse hymns by worship context.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
