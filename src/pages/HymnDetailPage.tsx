import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  MoreHorizontal,
  Copy,
  Check,
  Presentation,
  BookOpen,
  Minus,
  Plus,
} from 'lucide-react';
import { Verse } from '../features/hymns/Verse';
import { Chorus } from '../features/hymns/Chorus';
import { EmptyState, Dropdown, DropdownItem, DropdownSeparator } from '../components/ui';
import { hymnService } from '../services/hymnService';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui';
import { PreviousNextNavigation } from '../components/PreviousNextNavigation';
import { HymnNumber } from '../components/HymnNumber';
import { CategoryChip } from '../components/CategoryChip';
import type { TextSize } from '../types/hymn';

const SIZES: TextSize[] = ['sm', 'md', 'lg', 'xl'];

export const HymnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, addRecentlyViewed, readerSettings, setTextSize } = useApp();
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);

  const hymn = useMemo(() => {
    if (!id) return undefined;
    return hymnService.getHymnById(id) || hymnService.getHymnByNumber(parseInt(id, 10));
  }, [id]);

  useEffect(() => {
    if (hymn) {
      addRecentlyViewed(hymn.id);
      document.title = `Hymn ${hymn.number}: ${hymn.title} | Efik Hymn Book`;
    }
    return () => {
      document.title = 'Efik Hymn Book';
    };
  }, [hymn, addRecentlyViewed]);

  const { prev, next } = useMemo(() => {
    if (!hymn) return { prev: null, next: null };
    return hymnService.getAdjacentHymns(hymn.number);
  }, [hymn]);

  const sizeIndex = SIZES.indexOf(readerSettings.textSize);

  const handleShare = async () => {
    if (!hymn) return;
    const shareData = {
      title: `Hymn ${hymn.number}: ${hymn.title}`,
      text: `Read Hymn ${hymn.number} (${hymn.title}) on the Efik Hymn Book:`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed
      }
    } else {
      copyLyrics();
    }
  };

  const copyLyrics = () => {
    if (!hymn) return;
    const text = [
      `Hymn ${hymn.number}: ${hymn.title}`,
      hymn.alternateTitle ? `(${hymn.alternateTitle})` : '',
      '',
      ...hymn.verses.flatMap((v) => [`Verse ${v.number}:`, ...v.lines, '']),
      hymn.chorus ? ['Chorus:', ...hymn.chorus, ''] : [],
      'From Efik Hymn Book',
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast('Lyrics copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavourite = () => {
    if (!hymn) return;
    const nowActive = !isFavorite(hymn.id);
    toggleFavorite(hymn.id);
    toast(nowActive ? 'Added to Favourites' : 'Removed from Favourites', nowActive ? 'success' : 'info');
  };

  if (!hymn) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Hymn not found"
        description={`We could not find a hymn with the identifier "${id}". It may not exist in this edition.`}
        actionLabel="Browse all hymns"
        actionTo="/hymns"
      />
    );
  }

  const favorited = isFavorite(hymn.id);
  const scriptureText = hymn.scripture?.text;
  const scriptureRef = hymn.scripture?.reference;

  const iconBtn =
    'h-9 w-9 rounded-[10px] border border-border bg-surface hover:bg-surface-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors focus-ring disabled:opacity-40 disabled:pointer-events-none';

  return (
    <div className="max-w-[780px] mx-auto">
      {/* Top row: back + reader actions */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link
          to="/hymns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md"
        >
          <ArrowLeft size={16} />
          <span>Back to Hymns</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Text size stepper */}
          <div
            className="flex items-center rounded-[10px] border border-border bg-surface overflow-hidden"
            role="group"
            aria-label="Adjust text size"
          >
            <button
              type="button"
              onClick={() => setTextSize(SIZES[Math.max(0, sizeIndex - 1)])}
              disabled={sizeIndex === 0}
              aria-label="Decrease text size"
              className={iconBtn + ' border-0 border-r border-border rounded-none'}
            >
              <Minus size={14} />
            </button>
            <span className="px-2 text-[11px] font-semibold text-subtle-foreground w-9 text-center tabular-nums" aria-hidden>
              {sizeIndex + 1}/4
            </span>
            <button
              type="button"
              onClick={() => setTextSize(SIZES[Math.min(SIZES.length - 1, sizeIndex + 1)])}
              disabled={sizeIndex === SIZES.length - 1}
              aria-label="Increase text size"
              className={iconBtn + ' border-0 rounded-none'}
            >
              <Plus size={14} />
            </button>
          </div>

          <button type="button" onClick={handleShare} aria-label="Share hymn" title="Share hymn" className={iconBtn}>
            <Share2 size={15} />
          </button>

          <button
            type="button"
            onClick={toggleFavourite}
            aria-label={favorited ? 'Remove from Favourites' : 'Add to Favourites'}
            aria-pressed={favorited}
            title={favorited ? 'Remove from Favourites' : 'Add to Favourites'}
            className={`${iconBtn} ${favorited ? 'text-danger' : ''}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* More options */}
          <Dropdown
            trigger={
              <button type="button" aria-label="More options" className={iconBtn}>
                <MoreHorizontal size={15} />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem
                  icon={copied ? <Check className="text-success" /> : <Copy />}
                  onClick={() => {
                    copyLyrics();
                    close();
                  }}
                >
                  {copied ? 'Copied!' : 'Copy Lyrics'}
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon={<Presentation />}
                  onClick={() => navigate(`/hymns/${hymn.id}/present`)}
                >
                  Presentation Mode
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>
      </div>

      {/* Hymn header */}
      <header className="pb-8 mb-2 border-b border-border">
        <HymnNumber number={hymn.number} size="hero" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          {hymn.title}
        </h1>
        {hymn.alternateTitle && (
          <p className="mt-1.5 font-serif italic text-base sm:text-lg text-muted-foreground">
            {hymn.alternateTitle}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CategoryChip label={hymn.category} to="/categories" />
          {hymn.tune && (
            <span className="text-xs text-subtle-foreground">
              Tune: <span className="italic">{hymn.tune}</span>
            </span>
          )}
          {hymn.meter && (
            <span className="text-xs text-subtle-foreground font-mono">{hymn.meter}</span>
          )}
        </div>
      </header>

      {/* Verses — whitespace over cards */}
      <article className="py-8" aria-label="Hymn lyrics">
        {hymn.verses.map((verse, index) => (
          <React.Fragment key={verse.number}>
            <Verse verse={verse} textSizeClass={`hymn-size-${readerSettings.textSize}`} isSerif={readerSettings.serifLyrics} showNumber={readerSettings.showVerseNumbers} />
            {hymn.chorus && index === 0 && (
              <Chorus
                lines={hymn.chorus}
                englishLines={hymn.englishChorus}
                textSizeClass={`hymn-size-${readerSettings.textSize}`}
                isSerif={readerSettings.serifLyrics}
              />
            )}
          </React.Fragment>
        ))}

        {/* Amen */}
        <p className="mt-10 sm:pl-10 font-serif text-sm font-bold tracking-[0.25em] text-accent uppercase select-none">
          Amen
        </p>

        {/* Optional scripture — quiet aside, not a card */}
        {scriptureText && scriptureRef && (
          <aside className="mt-10 max-w-xl border-l-2 border-accent/50 pl-4">
            <blockquote className="font-serif italic text-sm sm:text-base text-muted-foreground leading-relaxed">
              “{scriptureText}”
            </blockquote>
            <cite className="block mt-1 not-italic text-[11px] font-semibold uppercase tracking-wider text-subtle-foreground">
              {scriptureRef}
            </cite>
          </aside>
        )}
      </article>

      {/* Prev / next */}
      <PreviousNextNavigation prevHymn={prev} nextHymn={next} />
    </div>
  );
};
