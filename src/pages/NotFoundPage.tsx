import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--brand-primary-light)] text-[var(--brand-primary)] mb-5">
        <BookOpen size={32} />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-gold)] font-bold">
        Error 404
      </span>
      <h1 className="font-serif text-3xl font-bold text-[var(--text-primary)] mt-1">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
        The hymn or page you are looking for does not exist or may have been moved.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] font-medium text-sm transition-colors shadow-2xs"
        >
          <Home size={16} />
          <span>Return Home</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm transition-colors"
        >
          <Search size={16} />
          <span>Search Hymns</span>
        </Link>
      </div>
    </div>
  );
};
