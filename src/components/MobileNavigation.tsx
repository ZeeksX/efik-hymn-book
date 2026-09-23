import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Search, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNavigation: React.FC = () => {
  const { favorites } = useApp();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-[11px] font-medium transition-colors rounded-lg focus-ring ${
      isActive
        ? 'text-primary font-semibold'
        : 'text-subtle-foreground hover:text-foreground'
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-2 safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        <NavLink to="/" end className={navItemClass} aria-label="Home">
          <Home size={20} strokeWidth={1.75} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/hymns" className={navItemClass} aria-label="Hymns">
          <BookOpen size={20} />
          <span>Hymns</span>
        </NavLink>

        <NavLink to="/search" className={navItemClass} aria-label="Search">
          <Search size={20} />
          <span>Search</span>
        </NavLink>

        <NavLink to="/favorites" className={navItemClass} aria-label="Favourites">
          <span className="relative">
            <Heart size={20} />
            {favorites.length > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center"
                aria-hidden
              >
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </span>
          <span>Favourites</span>
        </NavLink>
      </div>
    </nav>
  );
};
