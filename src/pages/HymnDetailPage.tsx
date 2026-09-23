import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MoreHorizontal, ChevronLeft, ChevronRight, Presentation, Copy, Check } from 'lucide-react';
import { Verse } from '../features/hymns/Verse';
import { Chorus } from '../features/hymns/Chorus';
import { EmptyState } from '../components/EmptyState';
import { BookOpen } from 'lucide-react';
import { hymnService } from '../services/hymnService';
import { useApp } from '../context/AppContext';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { getCategoryBadgeClasses } from '../data/categories';
import type { TextSize } from '../types/hymn';

export const HymnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, addRecentlyViewed, readerSettings, setTextSize } = useApp();

  const [activeVerse, setActiveVerse] = useState<number | 'chorus'>(1);
  const [copied, setCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const hymn = useMemo(() => {
    if (!id) return undefined;
    return hymnService.getHymnById(id) || hymnService.getHymnByNumber(parseInt(id, 10));
  }, [id]);

  // Track recently viewed
  useEffect(() => {
    if (hymn) {
      addRecentlyViewed(hymn.id);
      document.title = `Hymn ${hymn.number}: ${hymn.title} | Efik Hymn Book`;
    }
  }, [hymn, addRecentlyViewed]);

  // Adjacent hymns for prev/next navigation
  const { prev, next } = useMemo(() => {
    if (!hymn) return { prev: null, next: null };
    return hymnService.getAdjacentHymns(hymn.number);
  }, [hymn]);

  // Keyboard navigation
  useKeyboardNav({
    onPrevious: () => {
      if (prev) navigate(`/hymns/${prev.id}`);
    },
    onNext: () => {
      if (next) navigate(`/hymns/${next.id}`);
    },
    enabled: Boolean(hymn),
  });

  const fontSizes: TextSize[] = ['sm', 'md', 'lg', 'xl'];
  const currentSizeIndex = fontSizes.indexOf(readerSettings.textSize);

  const handleDecreaseFont = () => {
    if (currentSizeIndex > 0) {
      setTextSize(fontSizes[currentSizeIndex - 1]);
    }
  };

  const handleIncreaseFont = () => {
    if (currentSizeIndex < fontSizes.length - 1) {
      setTextSize(fontSizes[currentSizeIndex + 1]);
    }
  };

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
      handleCopyLyrics();
    }
  };

  const handleCopyLyrics = () => {
    if (!hymn) return;
    const text = [
      `Hymn ${hymn.number}: ${hymn.title}`,
      hymn.alternateTitle ? `(${hymn.alternateTitle})` : '',
      '',
      ...hymn.verses.flatMap((v) => [`Verse ${v.number}:`, ...v.lines, '']),
      hymn.chorus ? ['Chorus:', ...hymn.chorus.join('\n'), ''] : [],
      'From Efik Hymn Book',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToVerse = (num: number | 'chorus') => {
    setActiveVerse(num);
    const elemId = num === 'chorus' ? 'verse-chorus' : `verse-${num}`;
    const el = document.getElementById(elemId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!hymn) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Hymn Not Found"
        description={`We could not find a hymn with identifier "${id}". It may not exist in this edition.`}
        actionLabel="Browse all hymns"
        actionTo="/hymns"
      />
    );
  }

  const favorited = isFavorite(hymn.id);
  const textSizeClassMap = {
    sm: 'hymn-size-sm',
    md: 'hymn-size-md',
    lg: 'hymn-size-lg',
    xl: 'hymn-size-xl',
  };
  const activeSizeClass = textSizeClassMap[readerSettings.textSize] || 'hymn-size-md';
  const isSerif = readerSettings.serifLyrics;

  // Scripture fallback if not explicitly defined on hymn
  const scriptureText = hymn.scripture?.text || '"The Lord is my strength and my song."';
  const scriptureRef = hymn.scripture?.reference || 'Exodus 15:2';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Action Row matching Screen 3 */}
      <div className="flex items-center justify-between gap-4 py-1">
        {/* Back Link */}
        <Link
          to="/hymns"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to hymns</span>
        </Link>

        {/* Action Controls: A-, A+, Share, Heart, More */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font Size A- */}
          <button
            type="button"
            onClick={handleDecreaseFont}
            disabled={currentSizeIndex === 0}
            aria-label="Decrease font size"
            className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            A-
          </button>

          {/* Font Size A+ */}
          <button
            type="button"
            onClick={handleIncreaseFont}
            disabled={currentSizeIndex === fontSizes.length - 1}
            aria-label="Increase font size"
            className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            A+
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share hymn"
            title="Share hymn"
            className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Share2 size={15} />
          </button>

          {/* Heart Favorite Toggle */}
          <button
            type="button"
            onClick={() => toggleFavorite(hymn.id)}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            title={favorited ? 'Favorited' : 'Add to favorites'}
            className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Heart
              size={15}
              className={favorited ? 'fill-red-500 text-red-500' : ''}
            />
          </button>

          {/* More Options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              aria-label="More options"
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreHorizontal size={15} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => {
                    handleCopyLyrics();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Lyrics'}</span>
                </button>
                <Link
                  to={`/hymns/${hymn.id}/present`}
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--accent-gold)] hover:bg-[var(--bg-surface-elevated)] font-semibold"
                >
                  <Presentation size={14} />
                  <span>Presentation Mode</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hymn Reader Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Hymn Header matching Screen 3 */}
        <div className="space-y-3">
          {/* Big Hymn Number */}
          <div className="font-serif text-5xl sm:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
            {hymn.number}
          </div>

          {/* Hymn Title & Subtitle */}
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {hymn.title}
            </h1>
            {hymn.alternateTitle && (
              <p className="mt-1 text-sm sm:text-base font-serif italic text-[var(--text-secondary)]">
                {hymn.alternateTitle}
              </p>
            )}
          </div>

          {/* Category Tag */}
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getCategoryBadgeClasses(
                hymn.category
              )}`}
            >
              {hymn.category.split('&')[0].trim()}
            </span>
          </div>
        </div>

        {/* 3-Column Reading Layout matching Screen 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 items-start border-t border-[var(--border-subtle)]/70">
          {/* Left Rail: Verses Navigator */}
          <div className="hidden sm:flex md:col-span-2 flex-col gap-2 sticky top-24">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
              Verses
            </span>
            {hymn.verses.map((v) => {
              const isSelected = activeVerse === v.number;
              return (
                <button
                  key={v.number}
                  type="button"
                  onClick={() => scrollToVerse(v.number)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {v.number}
                </button>
              );
            })}
            {hymn.chorus && (
              <button
                type="button"
                onClick={() => scrollToVerse('chorus')}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center ${
                  activeVerse === 'chorus'
                    ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                Chorus
              </button>
            )}
          </div>

          {/* Center Column: Lyrics & Parallel English Translations */}
          <div className="md:col-span-6 space-y-4">
            {hymn.verses.map((verse, index) => (
              <React.Fragment key={verse.number}>
                <Verse
                  verse={verse}
                  textSizeClass={activeSizeClass}
                  isSerif={isSerif}
                />

                {/* Chorus rendered after verse 1 if present */}
                {hymn.chorus && index === 0 && (
                  <Chorus
                    lines={hymn.chorus}
                    englishLines={hymn.englishChorus}
                    textSizeClass={activeSizeClass}
                    isSerif={isSerif}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Amen */}
            <div className="pt-6 pb-2 text-left sm:pl-12">
              <span className="font-serif text-base font-bold tracking-widest text-[var(--accent-gold)] uppercase select-none">
                Amen
              </span>
            </div>
          </div>

          {/* Right Column: Devotional Scripture Card matching Screen 3 */}
          <div className="md:col-span-4 sticky top-24">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-xs bg-gradient-to-b from-[#FAF4E8] to-[#F1E8D5] dark:from-[#1D2B22] dark:to-[#16221A] p-6 text-center">
              {/* Serene landscape backdrop representation */}
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
                <svg className="w-full h-auto text-[var(--brand-primary)]" viewBox="0 0 200 80" fill="currentColor">
                  <path d="M0 80 Q 50 40 100 60 T 200 40 L 200 80 Z" />
                  <path d="M40 80 Q 90 20 150 70 L 200 80 Z" opacity="0.5" />
                </svg>
              </div>

              <div className="relative space-y-2 py-4">
                <blockquote className="font-serif italic text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
                  {scriptureText}
                </blockquote>
                <cite className="block not-italic text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {scriptureRef}
                </cite>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation matching Screen 3 */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
          {prev ? (
            <Link
              to={`/hymns/${prev.id}`}
              className="group flex items-center gap-3 p-3 sm:px-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] transition-all"
            >
              <ChevronLeft size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]" />
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)]">
                  Previous
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                  Hymn {prev.number}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              to={`/hymns/${next.id}`}
              className="group flex items-center gap-3 p-3 sm:px-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] transition-all ml-auto"
            >
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-[var(--text-tertiary)]">
                  Next
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                  Hymn {next.number}
                </span>
              </div>
              <ChevronRight size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
