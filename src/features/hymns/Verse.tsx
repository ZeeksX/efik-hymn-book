import React from 'react';
import type { HymnVerse } from '../../types/hymn';

interface VerseProps {
  verse: HymnVerse;
  textSizeClass: string;
  isSerif?: boolean;
}

export const Verse: React.FC<VerseProps> = ({
  verse,
  textSizeClass,
  isSerif = false,
}) => {
  return (
    <div className="flex gap-4 sm:gap-6 items-start my-6 sm:my-8">
      {/* Verse Number */}
      <span className="shrink-0 w-6 sm:w-8 font-mono text-sm sm:text-base font-bold text-[var(--accent-gold)] pt-1 text-right select-none">
        {verse.number}.
      </span>

      {/* Verse Lines */}
      <div
        className={`flex-1 text-[var(--text-primary)] ${textSizeClass} ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
      >
        {verse.lines.map((line, idx) => (
          <p key={idx} className="hymn-verse-line leading-relaxed sm:leading-loose">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
