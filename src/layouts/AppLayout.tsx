import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MobileNavigation } from '../components/MobileNavigation';
import { GoToHymnDialog } from '../components/GoToHymnDialog';
import { OfflineIndicator } from '../components/OfflineIndicator';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <OfflineIndicator />
      <AppHeader />

      {/* Content area — generous bottom clearance for mobile nav */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-16">
        <Outlet />
      </main>

      {/* Quiet footer */}
      <footer className="border-t border-border bg-surface py-8 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <span className="font-serif font-bold text-foreground">Rehoboth Assembly Hymn Book</span>
            <span className="hidden sm:inline text-border-strong">•</span>
            <span className="text-center sm:text-left">
              The Apostolic Church Nigeria · Great-Ilasa District, Great-Ilasa Area, LAWMNA Territory
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/about" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              About &amp; Sources
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Terms &amp; Conditions
            </Link>
            <Link to="/settings" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Settings
            </Link>
          </div>
        </div>
      </footer>

      <MobileNavigation />
      <GoToHymnDialog />
    </div>
  );
};
