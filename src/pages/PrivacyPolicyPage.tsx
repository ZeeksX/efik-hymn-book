import React from 'react';
import { ShieldCheck, Database, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-1">
          <ShieldCheck size={14} />
          <span>Legal &amp; Transparency</span>
        </div>
        <h1 className="text-h1 text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: September 2026. This application operates with a strict privacy-first
          architecture.
        </p>
      </div>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-h2 text-foreground flex items-center gap-2">
          <EyeOff size={18} className="text-primary" />
          <span>Summary: No Tracking, No Profiling</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The Rehoboth Assembly Hymn Book application is designed purely as a sacred reading and discovery tool
          for church worship, choir rehearsals, and personal devotion. Signing in is optional and
          exists only to keep your favourites and history in one place.
        </p>
      </section>

      {/* On-device storage */}
      <section className="space-y-4">
        <h2 className="text-h2 text-foreground flex items-center gap-2">
          <Database size={18} className="text-accent" />
          <span>On-Device Storage (localStorage)</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All preferences and saved items are saved exclusively in your browser's local storage:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Favourites:</strong> Stored locally on your device so
            you can reach your saved hymns quickly during church service.
          </li>
          <li>
            <strong className="text-foreground">Recently Viewed History:</strong> Keeps track of
            recently accessed hymns directly in your browser.
          </li>
          <li>
            <strong className="text-foreground">Reader Preferences:</strong> Preserves your chosen
            font size (Small to Extra Large), typography preference (Serif/Sans), and theme
            (Light/Dark/System).
          </li>
          <li>
            <strong className="text-foreground">Recent Searches:</strong> Stored locally to speed up
            repeated queries.
          </li>
        </ul>
        <p className="text-xs text-subtle-foreground pt-2 border-t border-border">
          This data is never transmitted to any external server. Clearing your browser data or using
          the "Data" controls in Settings clears this data immediately.
        </p>
      </section>

      {/* Offline caching */}
      <section className="space-y-3">
        <h2 className="text-h2 text-foreground flex items-center gap-2">
          <Lock size={18} className="text-primary" />
          <span>Offline Service Worker Caching</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The application uses standard Progressive Web App (PWA) service worker caching. Hymn
          lyrics, interface code, and typography are cached on your device to ensure reliable
          offline reading in sanctuaries or areas with poor cellular reception. No personal
          information is cached.
        </p>
      </section>

      {/* Inquiries */}
      <section className="pt-4 border-t border-border space-y-2">
        <h2 className="text-h3 text-foreground">Inquiries &amp; Corrections</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions regarding this privacy policy or wish to report a hymn text
          correction, please visit our{' '}
          <Link to="/about" className="text-primary font-semibold hover:underline focus-ring rounded-sm">
            About page
          </Link>.
        </p>
      </section>
    </div>
  );
};
