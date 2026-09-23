import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Grid3X3,
  Heart,
  History,
  Settings,
  Info,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Drawer } from './ui';

interface AccountSheetProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export const AccountSheet: React.FC<AccountSheetProps> = ({ open, onClose, onSignOut }) => {
  const { user } = useAuth();
  if (!user) return null;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors focus-ring ${
      isActive
        ? 'bg-primary-soft text-primary font-semibold'
        : 'text-foreground hover:bg-surface-secondary'
    }`;

  return (
    <Drawer open={open} onClose={onClose} title="Account" side="right">
      {/* Identity */}
      <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border">
        <span className="w-11 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
          {user.initials}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary-soft text-primary">
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5" aria-label="Account navigation">
        <NavLink to="/" end onClick={onClose} className={linkClasses}>
          <Home size={17} className="text-subtle-foreground" /> Home
        </NavLink>
        <NavLink to="/hymns" onClick={onClose} className={linkClasses}>
          <BookOpen size={17} className="text-subtle-foreground" /> Hymns
        </NavLink>
        <NavLink to="/categories" onClick={onClose} className={linkClasses}>
          <Grid3X3 size={17} className="text-subtle-foreground" /> Categories
        </NavLink>
        <NavLink to="/favorites" onClick={onClose} className={linkClasses}>
          <Heart size={17} className="text-subtle-foreground" /> Favourites
        </NavLink>
        <NavLink to="/history" onClick={onClose} className={linkClasses}>
          <History size={17} className="text-subtle-foreground" /> Recently Viewed
        </NavLink>
        <NavLink to="/settings" onClick={onClose} className={linkClasses}>
          <Settings size={17} className="text-subtle-foreground" /> Settings
        </NavLink>
        <NavLink to="/about" onClick={onClose} className={linkClasses}>
          <Info size={17} className="text-subtle-foreground" /> About
        </NavLink>
      </nav>

      {/* Admin access */}
      {user.role === 'admin' && (
        <>
          <p className="mt-5 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground">
            Administration
          </p>
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-foreground hover:bg-surface-secondary transition-colors focus-ring"
          >
            <Shield size={17} className="text-accent" /> Admin Dashboard
          </Link>
        </>
      )}

      {/* Sign out */}
      <div className="mt-5 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-danger hover:bg-danger-soft transition-colors focus-ring"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </Drawer>
  );
};
