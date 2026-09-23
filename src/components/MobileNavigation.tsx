import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Search, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNavigation: React.FC = () => {
  const { favorites } = useApp();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
      isActive
        ? 'text-[var(--brand-primary)] font-bold'
        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {/* Home */}
        <NavLink to="/" end className={navItemClass}>
          <Home size={21} className="mb-1" />
          <span>Home</span>
        </NavLink>

        {/* Hymns */}
        <NavLink to="/hymns" className={navItemClass}>
          <BookOpen size={21} className="mb-1" />
          <span>Hymns</span>
        </NavLink>

        {/* Search */}
        <NavLink to="/search" className={navItemClass}>
          <Search size={21} className="mb-1" />
          <span>Search</span>
        </NavLink>

        {/* Favorites */}
        <NavLink to="/favorites" className={navItemClass}>
          <div className="relative mb-1">
            <Heart size={21} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1 rounded-xs bg-[var(--accent-gold)] text-white min-w-[14px] text-center">
                {favorites.length}
              </span>
            )}
          </div>
          <span>Favorites</span>
        </NavLink>
      </div>
    </nav>
  );
};
