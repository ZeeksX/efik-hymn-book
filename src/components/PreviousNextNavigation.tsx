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
    <div className="pt-8 pb-4 border-t border-[var(--border-subtle)] mt-12">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Previous Hymn */}
        {prevHymn ? (
          <Link
            to={`/hymns/${prevHymn.id}`}
            className="group flex-1 flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--brand-primary)]/30 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-surface-elevated)] group-hover:bg-[var(--brand-primary-light)] text-[var(--brand-primary)] shrink-0 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] block">
                Previous • Hymn {formatHymnNumber(prevHymn.number)}
              </span>
              <p className="font-serif text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] truncate transition-colors">
                {prevHymn.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}

        {/* Next Hymn */}
        {nextHymn ? (
          <Link
            to={`/hymns/${nextHymn.id}`}
            className="group flex-1 flex items-center justify-end gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--brand-primary)]/30 transition-all text-right"
          >
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] block">
                Next • Hymn {formatHymnNumber(nextHymn.number)}
              </span>
              <p className="font-serif text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] truncate transition-colors">
                {nextHymn.title}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-surface-elevated)] group-hover:bg-[var(--brand-primary-light)] text-[var(--brand-primary)] shrink-0 transition-colors">
              <ArrowRight size={16} />
            </div>
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}
      </div>

      {/* Desktop keyboard helper note */}
      <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-[11px] text-[var(--text-tertiary)]">
        <span>Tip: Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-[10px]">
          ←
        </kbd>
        <span>or</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-[10px]">
          →
        </kbd>
        <span>keys on your keyboard to navigate hymns</span>
      </div>
    </div>
  );
};
