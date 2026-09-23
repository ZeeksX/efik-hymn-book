import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
      <span className="w-14 h-14 rounded-[14px] flex items-center justify-center bg-primary-soft text-primary mb-5">
        <BookOpen size={28} strokeWidth={1.5} />
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">Error 404</span>
      <h1 className="font-serif text-3xl font-bold text-foreground mt-1.5">Page Not Found</h1>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
        The hymn or page you are looking for does not exist or may have been moved.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors focus-ring"
        >
          <Home size={15} />
          <span>Return Home</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-border-strong/70 bg-surface hover:bg-surface-secondary text-foreground text-sm font-medium transition-colors focus-ring"
        >
          <Search size={15} />
          <span>Search Hymns</span>
        </Link>
      </div>
    </div>
  );
};
