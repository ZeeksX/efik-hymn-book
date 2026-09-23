import React, { useState } from 'react';
import { Share2, Copy, Check, Presentation, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Hymn } from '../../types/hymn';
import { FavoriteButton } from '../../components/FavoriteButton';
import { ThemeToggle } from '../../components/ThemeToggle';
import { FontSizeControl } from './FontSizeControl';
import { useApp } from '../../context/AppContext';

interface ReaderToolbarProps {
  hymn: Hymn;
  className?: string;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  hymn,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const { readerSettings, updateReaderSettings } = useApp();

  const handleCopy = async () => {
    try {
      const versesText = hymn.verses
        .map((v) => `${v.number}.\n${v.lines.join('\n')}`)
        .join('\n\n');
      const chorusText = hymn.chorus ? `\n\nCHORUS:\n${hymn.chorus.join('\n')}` : '';
      const fullText = `HYMN ${hymn.number}: ${hymn.title}\n(${hymn.category})\n\n${versesText}${chorusText}\n\n— Efik Hymn Book`;

      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hymn ${hymn.number} — ${hymn.title}`,
          text: `Read Hymn ${hymn.number} (${hymn.title}) from the Efik Hymn Book:`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs ${className}`}
    >
      {/* Left: Text Size Controls */}
      <div className="flex items-center gap-2">
        <FontSizeControl />

        {/* Toggle Serif/Sans font for lyrics */}
        <button
          type="button"
          onClick={() =>
            updateReaderSettings({ serifLyrics: !readerSettings.serifLyrics })
          }
          title={readerSettings.serifLyrics ? 'Switch to Sans-serif lyrics' : 'Switch to Serif lyrics'}
          aria-label="Toggle serif font"
          className={`p-2 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
            readerSettings.serifLyrics
              ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
          }`}
        >
          <Type size={16} />
          <span className="hidden sm:inline text-xs">
            {readerSettings.serifLyrics ? 'Serif' : 'Sans'}
          </span>
        </button>
      </div>

      {/* Right: Actions (Presentation, Copy, Share, Favorite, Dark Mode) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Presentation Mode Button */}
        <Link
          to={`/hymns/${hymn.id}/present`}
          title="Open church presentation mode"
          aria-label="Presentation Mode"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] hover:bg-[var(--brand-primary-light)] text-[var(--brand-primary)] border border-[var(--border-subtle)] transition-colors"
        >
          <Presentation size={15} />
          <span className="hidden sm:inline">Present</span>
        </Link>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          title="Copy hymn lyrics"
          aria-label="Copy hymn lyrics"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
        >
          {copied ? (
            <Check size={18} className="text-[var(--color-success)]" />
          ) : (
            <Copy size={18} />
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          title="Share hymn"
          aria-label="Share hymn"
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
        >
          <Share2 size={18} />
        </button>

        {/* Favorite Button */}
        <FavoriteButton hymnId={hymn.id} size="md" />

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
};
