import React, { useState } from 'react';
import { NavLink, Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  FileEdit,
  Users,
  Volume2,
  Settings,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hymns', label: 'Hymns', icon: BookOpen },
  { to: '/admin/categories', label: 'Categories', icon: Grid3X3 },
  { to: '/admin/corrections', label: 'Corrections', icon: FileEdit, badge: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/audio', label: 'Audio', icon: Volume2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pending = adminService
    .getCorrections()
    .filter((c) => c.status === 'pending').length;

  return (
    <>
      {/* Brand */}
      <div className="px-5 h-16 flex items-center justify-between border-b border-border shrink-0">
        <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-lg" aria-label="Rehoboth Assembly Hymn Book Home">
          <img
            src="/rehoboth-logo.jpg"
            alt="Rehoboth Assembly logo"
            className="w-8 h-8 rounded-lg object-cover"
            width={32}
            height={32}
            loading="eager"
          />
          <span className="font-serif font-bold text-sm text-foreground leading-tight">
            Rehoboth Assembly
            <span className="block text-[10px] font-sans font-medium text-muted-foreground">
              Administration
            </span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors focus-ring ${
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-secondary'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            {badge && pending > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-warning-soft text-warning tabular-nums">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: profile + exit */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
        >
          <ArrowLeft size={16} />
          <span>Back to Public App</span>
        </Link>
      </div>
    </>
  );
}

/** Shown when a signed-in non-admin tries to open admin routes */
function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center p-10 rounded-[16px] border border-border bg-surface">
        <span className="inline-flex w-14 h-14 rounded-[14px] items-center justify-center bg-danger-soft text-danger mb-4">
          <ShieldAlert size={28} strokeWidth={1.5} />
        </span>
        <h1 className="font-serif text-2xl font-bold text-foreground">403 — Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          You do not have permission to view the administration area. Ask an administrator for
          editor or admin access.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors focus-ring"
        >
          <ArrowLeft size={15} />
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Resolve authorization BEFORE rendering any protected UI.
  // The admin surface is never flashed to unauthorised users.
  if (!isAuthenticated || !isAdmin) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <AccessDenied />;
  }

  const pendingCount = adminService
    .getCorrections()
    .filter((c) => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-surface sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] flex">
          <div
            className="fixed inset-0 bg-black/50 animate-overlay-in"
            onClick={() => setMobileNavOpen(false)}
            role="presentation"
          />
          <aside className="relative w-64 bg-surface border-r border-border flex flex-col animate-sheet-up">
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 p-1.5 rounded-lg text-subtle-foreground hover:text-foreground focus-ring"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      {/* Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
            >
              <Menu size={19} />
            </button>
            <span className="hidden sm:flex items-center gap-2 text-xs font-semibold text-subtle-foreground uppercase tracking-wider">
              <ShieldCheck size={14} className="text-primary" />
              Administration
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {pendingCount > 0 && (
              <Link
                to="/admin/corrections"
                className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold bg-warning-soft text-warning hover:opacity-80 transition-opacity focus-ring"
              >
                <FileEdit size={13} />
                {pendingCount} pending correction{pendingCount === 1 ? '' : 's'}
              </Link>
            )}
            <span className="flex items-center gap-2 p-1 pr-2.5 rounded-lg border border-border bg-surface">
              <span className="w-7 h-7 rounded-md bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                {user?.initials}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-foreground">
                {user?.name}
              </span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
