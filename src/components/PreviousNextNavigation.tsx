import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Hymn } from '../types/hymn';
import { formatHymnNumber } from '../utils/formatters';

interface PreviousNextNavigationProps {
  prevHymn: Hymn | null;
  nextHymn: Hymn | null;
}

export const PreviousNextNavigation: React.FC<PreviousNextNavigationProps> = ({
  prevHymn,
  nextHymn,
}) => {
  return (
    <div className="pt-8 pb-2 border-t border-border mt-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {prevHymn ? (
          <Link
            to={`/hymns/${prevHymn.id}`}
            className="group flex-1 flex items-center gap-3 p-3 rounded-[12px] border border-border bg-surface hover:bg-surface-secondary hover:border-border-strong transition-colors text-left focus-ring"
          >
            <ArrowLeft size={16} className="text-subtle-foreground group-hover:text-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-subtle-foreground">
                Previous · Hymn {formatHymnNumber(prevHymn.number)}
              </span>
              <p className="font-serif text-sm font-semibold text-foreground group-hover:text-primary truncate transition-colors">
                {prevHymn.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}

        {nextHymn ? (
          <Link
            to={`/hymns/${nextHymn.id}`}
            className="group flex-1 flex items-center justify-end gap-3 p-3 rounded-[12px] border border-border bg-surface hover:bg-surface-secondary hover:border-border-strong transition-colors text-right focus-ring"
          >
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-subtle-foreground">
                Next · Hymn {formatHymnNumber(nextHymn.number)}
              </span>
              <p className="font-serif text-sm font-semibold text-foreground group-hover:text-primary truncate transition-colors">
                {nextHymn.title}
              </p>
            </div>
            <ArrowRight size={16} className="text-subtle-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}
      </div>

      {/* Keyboard hint — desktop only */}
      <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-[11px] text-subtle-foreground">
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface-secondary font-mono text-[10px]">←</kbd>
        <span>or</span>
        <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface-secondary font-mono text-[10px]">→</kbd>
        <span>to move between hymns</span>
      </div>
    </div>
  );
};
