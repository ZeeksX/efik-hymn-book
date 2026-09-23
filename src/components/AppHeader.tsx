import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { AccountSheet } from './AccountSheet';
import { BrandMark } from './BrandMark';

export const AppHeader: React.FC = () => {
  const { favorites, openGoToHymn } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-medium transition-colors focus-ring rounded-md ${
      isActive
        ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold after:rounded-full'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  const iconBtn =
    'p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring';

  const handleSignOut = () => {
    setAccountOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface border-b border-border transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand lockup */}
          <BrandMark />

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            <NavLink to="/hymns" className={navLinkClasses}>Hymns</NavLink>
            <NavLink to="/categories" className={navLinkClasses}>Categories</NavLink>
            <NavLink to="/about" className={navLinkClasses}>About</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Go to Hymn — gold CTA per brand system */}
            <button
              type="button"
              onClick={openGoToHymn}
              title="Go to Hymn (Ctrl+K)"
              aria-label="Go to Hymn"
              className="hidden md:inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] bg-gold text-on-gold text-xs font-semibold hover:bg-gold-strong transition-colors focus-ring shadow-xs"
            >
              <Search size={14} strokeWidth={2} />
              <span>Go to Hymn</span>
              <kbd className="hidden lg:inline font-mono text-[10px] px-1.5 py-0.5 rounded border border-on-gold/25 bg-white/15 text-on-gold">
                Ctrl K
              </kbd>
            </button>

            <Link to="/search" aria-label="Search hymns" title="Search" className={`${iconBtn} md:hidden`}>
              <Search size={19} />
            </Link>

            <Link to="/favorites" aria-label="Favourites" title="Favourites" className={`${iconBtn} relative hidden sm:inline-flex`}>
              <Heart size={19} />
              {favorites.length > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-on-gold text-[9px] font-bold flex items-center justify-center"
                  aria-hidden
                >
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            <ThemeToggle />

            {/* Account */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setAccountOpen(true)}
                className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-surface-secondary border border-border transition-colors focus-ring"
                aria-haspopup="dialog"
                aria-expanded={accountOpen}
                aria-label="Open account menu"
              >
                <span className="w-7 h-7 rounded-md bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                  {user.initials}
                </span>
                <span className="hidden lg:inline text-xs font-semibold text-foreground max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center h-9 px-3.5 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors focus-ring"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <AccountSheet
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onSignOut={handleSignOut}
      />
    </>
  );
};
