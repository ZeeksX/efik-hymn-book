import React from 'react';
import { ShieldCheck, Database, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-2">
      {/* Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <ShieldCheck size={14} />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Last updated: September 2026. This application operates with a strict privacy-first architecture.
        </p>
      </div>

      {/* Overview Card */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <EyeOff size={18} className="text-[var(--brand-primary)]" />
          <span>Summary: No Tracking, No Accounts, No Profiling</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          The Efik Hymn Book application is designed purely as a sacred reading and discovery tool for church worship, choir rehearsals, and personal devotion. We do not require you to create an account, provide an email address, or disclose your identity.
        </p>
      </section>

      {/* Data Storage Policy */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Database size={18} className="text-[var(--accent-gold)]" />
          <span>On-Device Storage (localStorage)</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          All preferences and saved items are saved exclusively in your browser's local storage:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-secondary)]">
          <li>
            <strong className="text-[var(--text-primary)]">Bookmarked Favorites:</strong> Stored locally on your device so you can access your favorite hymns quickly during church service.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Recently Viewed History:</strong> Keeps track of recently accessed hymn numbers directly in your browser.
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Reader Preferences:</strong> Preserves your chosen font size (Small to Extra Large), typography preference (Serif/Sans), and theme (Light/Dark/System).
          </li>
          <li>
            <strong className="text-[var(--text-primary)]">Recent Searches:</strong> Stored locally to speed up repeated queries.
          </li>
        </ul>
        <p className="text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)]">
          This data is never transmitted to any external server. Clearing your browser data or clicking "Reset Preferences" in Settings clears this data immediately.
        </p>
      </section>

      {/* Offline Caching */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Lock size={18} className="text-[var(--brand-primary)]" />
          <span>Offline Service Worker Caching</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The application uses standard Progressive Web App (PWA) service worker caching. Hymn lyrics, interface code, and typography are cached on your device to ensure reliable offline reading in sanctuaries or areas with poor cellular reception. No personal information is cached.
        </p>
      </section>

      {/* Inquiries */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
        <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
          Inquiries & Corrections
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          If you have questions regarding this privacy policy or wish to report a hymn text correction, please visit our <Link to="/about" className="text-[var(--brand-primary)] font-semibold hover:underline">About page</Link>.
        </p>
      </section>
    </div>
  );
};
