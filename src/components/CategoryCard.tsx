import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Music, HandHeart, Flame, Wind, Cross, Wine, Star, Sunrise, SunMedium, Moon, Heart, Sparkles, Shield } from 'lucide-react';
import type { Category } from '../types/category';

interface CategoryCardProps {
  category: Category & { count?: number };
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  Music,
  HandHeart,
  Flame,
  Wind,
  Cross,
  Wine,
  Star,
  Sunrise,
  SunMedium,
  Moon,
  Heart,
  Sparkles,
  Shield,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = (category.iconName && iconMap[category.iconName]) || Users;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group flex items-center gap-4 p-4 sm:p-5 rounded-[14px] border border-border bg-surface hover:bg-surface-secondary hover:border-primary-soft-border transition-colors focus-ring"
    >
      {/* Restrained icon container — one brand treatment for all categories */}
      <span className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-primary-soft text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon size={20} strokeWidth={1.6} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-serif font-bold text-[15px] sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
          {category.name}
        </span>
        <span className="block text-xs text-muted-foreground mt-0.5 tabular-nums">
          {category.count ?? category.hymnCount ?? 0} hymns
        </span>
      </span>
    </Link>
  );
};
