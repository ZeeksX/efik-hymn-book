import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Maximize2, Minimize2, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { hymnService } from '../services/hymnService';
import { formatHymnNumber } from '../utils/formatters';

interface SlideItem {
  type: 'title' | 'verse' | 'chorus';
  label: string;
  lines: string[];
}

export const PresentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const hymn = useMemo(() => {
    if (!id) return undefined;
    return hymnService.getHymnById(id) || hymnService.getHymnByNumber(parseInt(id, 10));
  }, [id]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);

  // Slide sequence: Title -> Verse 1 -> Chorus -> Verse 2 -> Chorus ...
  const slides: SlideItem[] = useMemo(() => {
    if (!hymn) return [];
    const list: SlideItem[] = [
      {
        type: 'title',
        label: `HYMN ${formatHymnNumber(hymn.number)}`,
        lines: [hymn.title, hymn.alternateTitle ?? '', hymn.category],
      },
    ];
    hymn.verses.forEach((verse) => {
      list.push({ type: 'verse', label: `Verse ${verse.number}`, lines: verse.lines });
      if (hymn.chorus) {
        list.push({ type: 'chorus', label: 'Chorus', lines: hymn.chorus });
      }
    });
    return list;
  }, [hymn]);

  /* ----- Fullscreen API ----- */
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen unsupported / denied
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /* ----- Keyboard navigation ----- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if (hymn) {
          navigate(`/hymns/${hymn.id}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, hymn, navigate]);

  /* ----- Auto-hide controls ----- */
  const armHideTimer = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setControlsVisible(true);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2600);
  };

  // Re-arm the hide timer on slide change; controls are shown by user interaction.
  useEffect(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2600);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [currentSlideIndex]);

  if (!hymn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[image:var(--gradient-brand)] text-white">
        <div className="text-center space-y-4">
          <BookOpen size={40} className="mx-auto text-gold" />
          <h1 className="text-2xl font-serif">Hymn Not Found</h1>
          <Link
            to="/hymns"
            className="inline-block px-5 py-2.5 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium"
          >
            Return to Hymns
          </Link>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Projection surfaces: deep navy canvas in dark presentation mode,
  // warm white in light presentation mode. The lyric text is everything.
  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col justify-between select-none bg-[image:var(--gradient-brand)] text-white`}
      onMouseMove={armHideTimer}
      onTouchStart={armHideTimer}
    >
      {/* Top bar */}
      <header
        className={`flex items-center justify-between px-4 sm:px-8 py-4 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono font-bold text-gold text-sm sm:text-base shrink-0">
            HYMN {formatHymnNumber(hymn.number)}
          </span>
          <span className="hidden sm:inline font-serif truncate max-w-xs md:max-w-md opacity-70">
            {hymn.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs opacity-60 mr-1 tabular-nums">
            {currentSlide.type === 'title' ? '' : `${currentSlideIndex} / ${slides.length - 1}`}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle fullscreen"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors focus-ring"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <Link
            to={`/hymns/${hymn.id}`}
            title="Exit Presentation"
            aria-label="Exit Presentation"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors focus-ring"
          >
            <X size={17} />
          </Link>
        </div>
      </header>

      {/* Lyrics canvas */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full px-6 sm:px-8 py-6">
        {currentSlide.type === 'title' ? (
          <div className="space-y-4 animate-dialog-in">
            <span className="inline-block px-3 py-1 rounded-md text-xs sm:text-sm font-mono tracking-widest text-gold uppercase bg-white/10">
              {currentSlide.label}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              {currentSlide.lines[0]}
            </h1>
            {currentSlide.lines[1] && (
              <p className="font-serif italic text-lg sm:text-2xl opacity-70">{currentSlide.lines[1]}</p>
            )}
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gold pt-3 font-semibold">
              {currentSlide.lines[2]}
            </p>
          </div>
        ) : (
          <div className="w-full space-y-3 sm:space-y-5 animate-dialog-in">
            <span
              className={`inline-block font-mono text-xs sm:text-sm font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-md ${
                currentSlide.type === 'chorus'
                  ? 'text-gold bg-white/10'
                  : 'opacity-60'
              }`}
            >
              {currentSlide.label}
            </span>

            <div className="hymn-size-present font-serif font-medium space-y-1.5 sm:space-y-2.5">
              {currentSlide.lines.map((line, idx) => (
                <p key={idx} className="leading-snug">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom controls */}
      <footer
        className={`flex items-center justify-between gap-4 max-w-4xl mx-auto w-full px-4 sm:px-8 py-4 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          disabled={currentSlideIndex === 0}
          onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs sm:text-sm font-semibold transition-colors focus-ring"
        >
          <ChevronLeft size={17} />
          <span>Previous</span>
        </button>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[180px] sm:max-w-md py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              title={s.label}
              aria-label={`Go to ${s.label}`}
              aria-current={idx === currentSlideIndex}
              className={`h-2 rounded-full transition-all focus-ring ${
                idx === currentSlideIndex
                  ? 'w-6 bg-gold'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs sm:text-sm font-semibold transition-colors focus-ring"
          >
            <span>Next</span>
            <ChevronRight size={17} />
          </button>
          <span className="hidden sm:inline-flex items-center h-10 px-3 rounded-[10px] font-mono text-xs tabular-nums opacity-60">
            {currentSlide.type === 'title' ? '—' : `${currentSlideIndex} / ${slides.length - 1}`}
          </span>
        </div>
      </footer>
    </div>
  );
};
