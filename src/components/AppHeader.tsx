import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Heart, ChevronDown, Settings, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const AppHeader: React.FC = () => {
  const { favorites } = useApp();
  const { user, isAuthenticated, logout, openAuthModal, setAdminRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-medium transition-colors ${
      isActive
        ? 'text-[var(--brand-primary)] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--brand-primary)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Efik Hymn Book Home"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--brand-primary)] text-white shadow-xs group-hover:bg-[var(--brand-primary-hover)] transition-colors">
            <BookOpen size={18} />
          </div>
          <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
            Efik Hymn Book
          </span>
        </Link>

        {/* Center Navigation Links matching mockup */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <NavLink to="/hymns" className={navLinkClasses}>
            Hymns
          </NavLink>
          <NavLink to="/categories" className={navLinkClasses}>
            Categories
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>
        </nav>

        {/* Right Actions matching mockup */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Icon */}
          <Link
            to="/search"
            aria-label="Search hymns"
            title="Search hymns"
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <Search size={18} />
          </Link>

          {/* Favorites Heart Icon */}
          <Link
            to="/favorites"
            aria-label="Favourites"
            title="My Favourites"
            className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-xs bg-[var(--accent-gold)]"></span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
              >
                <div className="w-7 h-7 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center">
                  {user.initials}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)]">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/favorites"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <Heart size={15} className="text-red-500" />
                    <span>My Favourites</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <Settings size={15} className="text-[var(--text-tertiary)]" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => {
                      if (user.role !== 'admin') setAdminRole(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <Shield size={15} className="text-[var(--accent-gold)]" />
                    <span>Admin Dashboard</span>
                  </Link>

                  <div className="my-1 border-t border-[var(--border-subtle)]"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminRole(user.role !== 'admin');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[11px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                  >
                    <UserIcon size={14} />
                    <span>Switch to {user.role === 'admin' ? 'User' : 'Admin'} Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openAuthModal}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={openAuthModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-colors cursor-pointer shadow-xs"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
