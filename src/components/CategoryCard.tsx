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
  const IconComponent = (category.iconName && iconMap[category.iconName]) || Users;

  const colorClasses: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-[#EBF7EE] dark:bg-[#1A3323]', text: 'text-[#1E7238] dark:text-[#6BD88E]' },
    sky: { bg: 'bg-[#EFF6FF] dark:bg-[#1E293B]', text: 'text-[#1D4ED8] dark:text-[#93C5FD]' },
    purple: { bg: 'bg-[#F5F3FF] dark:bg-[#2A223E]', text: 'text-[#6D28D9] dark:text-[#C4B5FD]' },
    amber: { bg: 'bg-[#FFFBEB] dark:bg-[#332617]', text: 'text-[#B45309] dark:text-[#FCD34D]' },
    cyan: { bg: 'bg-[#ECFEFF] dark:bg-[#152E36]', text: 'text-[#0E7490] dark:text-[#67E8F9]' },
    teal: { bg: 'bg-[#F0FDFA] dark:bg-[#153430]', text: 'text-[#0F766E] dark:text-[#5EEAD4]' },
    rose: { bg: 'bg-[#FFF1F2] dark:bg-[#34161C]', text: 'text-[#BE123C] dark:text-[#FDA4AF]' },
    yellow: { bg: 'bg-[#FEFCE8] dark:bg-[#302B15]', text: 'text-[#A16207] dark:text-[#FDE047]' },
    slate: { bg: 'bg-[#F1F5F9] dark:bg-[#242A35]', text: 'text-[#475569] dark:text-[#94A3B8]' },
    pink: { bg: 'bg-[#FDF2F8] dark:bg-[#331828]', text: 'text-[#BE185D] dark:text-[#F472B6]' },
    indigo: { bg: 'bg-[#EEF2FF] dark:bg-[#1E213D]', text: 'text-[#4338CA] dark:text-[#818CF8]' },
    violet: { bg: 'bg-[#F5F3FF] dark:bg-[#2A223E]', text: 'text-[#6D28D9] dark:text-[#A78BFA]' },
  };

  const color = category.color || 'emerald';
  const colorStyle = colorClasses[color] || colorClasses.emerald;

  return (
    <Link
      to={`/hymns?category=${category.slug}`}
      className="group p-6 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/30 text-center flex flex-col items-center justify-center transition-all shadow-xs hover:shadow-md"
    >
      {/* Soft circular icon container */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${colorStyle.bg} ${colorStyle.text}`}
      >
        <IconComponent size={24} />
      </div>

      <h3 className="font-serif font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
        {category.name}
      </h3>

      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        {category.count || category.hymnCount || 10} hymns
      </p>
    </Link>
  );
};
