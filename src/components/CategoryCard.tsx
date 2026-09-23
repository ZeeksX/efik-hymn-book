import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, HeartHandshake, HandMetal, Flame, Wind, Cross, Wine, Star, Sunrise, SunMedium, Moon, Heart, Smile, Shield } from 'lucide-react';
import type { Category } from '../types/category';
import { formatHymnCount } from '../utils/formatters';

interface CategoryCardProps {
  category: Category & { count?: number };
}

// Icon mapper for categories
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  HeartHandshake,
  HandMetal,
  Flame,
  Wind,
  Cross,
  Wine,
  Star,
  Sunrise,
  SunMedium,
  Moon,
  Heart,
  Smile,
  Shield,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = (category.iconName && iconMap[category.iconName]) || Sparkles;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex flex-col justify-between p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--brand-primary)]/30 transition-all duration-200 shadow-2xs hover:shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--brand-primary-light)] text-[var(--brand-primary)] group-hover:scale-105 transition-transform duration-200">
            <IconComponent size={20} />
          </div>
          {category.count !== undefined && (
            <span className="text-xs font-medium text-[var(--text-tertiary)] bg-[var(--bg-main)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
              {formatHymnCount(category.count)}
            </span>
          )}
        </div>
        <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
          {category.name}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]/60 flex items-center justify-between text-xs font-semibold text-[var(--accent-gold)]">
        <span>Browse hymns</span>
        <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
