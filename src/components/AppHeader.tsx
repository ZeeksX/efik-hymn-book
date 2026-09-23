import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Search, Hash, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useApp } from '../context/AppContext';

export const AppHeader: React.FC = () => {
  const { openGoToHymn, favorites } = useApp();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[var(--brand-primary)] group shrink-0"
          aria-label="Efik Hymn Book Home"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--brand-primary)] text-white shadow-xs group-hover:bg-[var(--brand-primary-hover)] transition-colors">
            <BookOpen size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg leading-tight tracking-tight text-[var(--text-primary)]">
              Efik Hymn Book
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[var(--accent-gold)] font-bold">
              Ñwed Ikwọ Efik
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/hymns" className={navLinkClasses}>
            Hymns
          </NavLink>
          <NavLink to="/categories" className={navLinkClasses}>
            Categories
          </NavLink>
          <NavLink to="/favorites" className={navLinkClasses}>
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[var(--accent-gold)] text-white">
                {favorites.length}
              </span>
            )}
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>
        </nav>

        {/* Right Actions: Quick Search, Go to #, Theme Toggle, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Go to Hymn Button */}
          <button
            type="button"
            onClick={openGoToHymn}
            title="Go directly to a hymn number (Ctrl+K)"
            aria-label="Go to hymn number"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer border border-[var(--brand-primary)]/20"
          >
            <Hash size={14} className="text-[var(--accent-gold)]" />
            <span className="hidden sm:inline">Go to Hymn</span>
            <span className="sm:hidden font-mono">#</span>
          </button>

          {/* Search Button (Header quick jump) */}
          <Link
            to="/search"
            aria-label="Search hymns"
            title="Search hymns"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <Search size={19} />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings Link */}
          <Link
            to="/settings"
            aria-label="Settings"
            title="Settings"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <Settings size={19} />
          </Link>
        </div>
      </div>
    </header>
  );
};
