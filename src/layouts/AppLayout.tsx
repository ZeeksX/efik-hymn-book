import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MobileNavigation } from '../components/MobileNavigation';
import { GoToHymnDialog } from '../components/GoToHymnDialog';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
      {/* Top Header */}
      <AppHeader />

      {/* Main Content Area with padding for bottom nav on mobile */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Reverent and Quiet Footer */}
      <footer className="hidden md:block border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-serif font-bold text-[var(--text-primary)]">
              Efik Hymn Book
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Digitized for church worship, personal devotion & choir ministry</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[var(--text-primary)] transition-colors">
              About & Sources
            </Link>
            <Link to="/categories" className="hover:text-[var(--text-primary)] transition-colors">
              Categories
            </Link>
            <Link to="/settings" className="hover:text-[var(--text-primary)] transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Global Quick Hymn Modal */}
      <GoToHymnDialog />
    </div>
  );
};
