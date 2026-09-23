import React, { useState, useEffect, useMemo } from 'react';
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

  // Build sequence of projection slides: Title -> Verse 1 -> Chorus (if any) -> Verse 2 -> Chorus...
  const slides: SlideItem[] = useMemo(() => {
    if (!hymn) return [];
    const list: SlideItem[] = [
      {
        type: 'title',
        label: `HYMN ${formatHymnNumber(hymn.number)}`,
        lines: [hymn.title, hymn.alternateTitle ? `"${hymn.alternateTitle}"` : '', hymn.category],
      },
    ];

    hymn.verses.forEach((verse) => {
      list.push({
        type: 'verse',
        label: `Verse ${verse.number}`,
        lines: verse.lines,
      });

      if (hymn.chorus) {
        list.push({
          type: 'chorus',
          label: 'Chorus',
          lines: hymn.chorus,
        });
      }
    });

    return list;
  }, [hymn]);

  // Handle Fullscreen API
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
      // Fullscreen not supported or allowed
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation for presentation slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape' && !document.fullscreenElement) {
        if (hymn) navigate(`/hymns/${hymn.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, hymn, navigate]);

  if (!hymn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
        <div className="text-center space-y-4">
          <BookOpen size={40} className="mx-auto text-[var(--accent-gold)]" />
          <h1 className="text-2xl font-serif">Hymn Not Found</h1>
          <Link
            to="/hymns"
            className="inline-block px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white text-sm"
          >
            Return to Hymns
          </Link>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0e1410] text-[#f5f1e8] p-4 sm:p-8 select-none">
      {/* Top Bar with Exit, Slide indicator, and Fullscreen toggle */}
      <header className="flex items-center justify-between text-xs sm:text-sm text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-[var(--accent-gold)] text-sm sm:text-base">
            HYMN {formatHymnNumber(hymn.number)}
          </span>
          <span className="hidden sm:inline text-neutral-500">•</span>
          <span className="hidden sm:inline font-serif truncate max-w-xs md:max-w-md">
            {hymn.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide counter */}
          <span className="font-mono text-xs text-neutral-400 mr-2">
            Slide {currentSlideIndex + 1} / {slides.length}
          </span>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Close / Return button */}
          <Link
            to={`/hymns/${hymn.id}`}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Exit Presentation"
            aria-label="Exit Presentation"
          >
            <X size={18} />
          </Link>
        </div>
      </header>

      {/* Center Max-Contrast Lyrics Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4 py-6">
        {currentSlide.type === 'title' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="inline-block px-3 py-1 rounded-md text-xs sm:text-sm font-mono tracking-widest text-[var(--accent-gold)] uppercase bg-neutral-800/80 border border-neutral-700">
              {currentSlide.label}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {currentSlide.lines[0]}
            </h1>
            {currentSlide.lines[1] && (
              <p className="font-serif italic text-lg sm:text-2xl text-neutral-300">
                {currentSlide.lines[1]}
              </p>
            )}
            <p className="text-sm sm:text-base uppercase tracking-widest text-[var(--accent-gold)] pt-4 font-semibold">
              {currentSlide.lines[2]}
            </p>
          </div>
        ) : (
          <div className="w-full space-y-4 sm:space-y-6 animate-in fade-in duration-150">
            <span
              className={`inline-block font-mono text-xs sm:text-sm font-bold tracking-widest uppercase px-3 py-1 rounded-md ${
                currentSlide.type === 'chorus'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  : 'bg-neutral-800/80 text-[var(--accent-gold)] border border-neutral-700'
              }`}
            >
              {currentSlide.label}
            </span>

            <div className="hymn-size-present font-serif font-medium text-white space-y-2 sm:space-y-3">
              {currentSlide.lines.map((line, idx) => (
                <p key={idx} className="leading-snug tracking-tight">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Controller Bar */}
      <footer className="flex items-center justify-between gap-4 max-w-4xl mx-auto w-full pt-4 border-t border-neutral-800/60">
        <button
          type="button"
          disabled={currentSlideIndex === 0}
          onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        {/* Dots indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-md py-1">
          {slides.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              title={s.label}
              className={`h-2 rounded-sm transition-all cursor-pointer ${
                idx === currentSlideIndex
                  ? 'w-6 bg-[var(--accent-gold)]'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={currentSlideIndex === slides.length - 1}
          onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
};
