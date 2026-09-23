import React from 'react';
import type { HymnVerse } from '../../types/hymn';

interface VerseProps {
  verse: HymnVerse;
  textSizeClass: string;
  isSerif?: boolean;
  showNumber?: boolean;
}

export const Verse: React.FC<VerseProps> = ({
  verse,
  textSizeClass,
  isSerif = true,
  showNumber = true,
}) => {
  return (
    <div id={`verse-${verse.number}`} className="flex gap-4 sm:gap-5 items-start my-7 sm:my-9 scroll-mt-24">
      {showNumber && (
        <span
          className="shrink-0 w-6 sm:w-7 font-mono text-xs sm:text-sm font-bold text-accent pt-[0.4em] text-right select-none"
          aria-label={`Verse ${verse.number}`}
        >
          {verse.number}.
        </span>
      )}

      <div className={`flex-1 text-foreground ${textSizeClass} ${isSerif ? 'font-serif' : 'font-sans'}`}>
        {verse.lines.map((line, idx) => (
          <p key={idx} className="hymn-verse-line">
            {line}
          </p>
        ))}

        {verse.englishLines && verse.englishLines.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 text-muted-foreground font-serif italic text-[0.72em] leading-relaxed space-y-1">
            {verse.englishLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
