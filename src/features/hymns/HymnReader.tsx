import React from 'react';
import type { Hymn } from '../../types/hymn';
import { Verse } from './Verse';
import { Chorus } from './Chorus';
import { HymnNumber } from '../../components/HymnNumber';
import { useApp } from '../../context/AppContext';

interface HymnReaderProps {
  hymn: Hymn;
}

export const HymnReader: React.FC<HymnReaderProps> = ({ hymn }) => {
  const { readerSettings } = useApp();

  const textSizeClassMap = {
    sm: 'hymn-size-sm',
    md: 'hymn-size-md',
    lg: 'hymn-size-lg',
    xl: 'hymn-size-xl',
  };

  const activeSizeClass = textSizeClassMap[readerSettings.textSize] || 'hymn-size-md';
  const isSerif = readerSettings.serifLyrics;

  return (
    <article className="w-full max-w-2xl sm:max-w-3xl mx-auto py-6 sm:py-10">
      {/* Hymn Header / Book Header */}
      <header className="text-center pb-8 sm:pb-12 border-b border-[var(--border-subtle)]/70">
        <div className="flex items-center justify-center gap-2 mb-3">
          <HymnNumber number={hymn.number} size="lg" />
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-3 leading-snug">
          {hymn.title}
        </h1>

        {hymn.alternateTitle && (
          <p className="mt-2 text-sm sm:text-base font-serif italic text-[var(--text-secondary)]">
            "{hymn.alternateTitle}"
          </p>
        )}

        {/* Liturgical & Musical metadata */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-xs text-[var(--text-tertiary)]">
          <span className="font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
            {hymn.category}
          </span>
          {hymn.tune && (
            <span>
              Tune: <strong className="font-medium text-[var(--text-secondary)]">{hymn.tune}</strong>
            </span>
          )}
          {hymn.meter && (
            <span>
              Meter: <span className="font-mono">{hymn.meter}</span>
            </span>
          )}
          {hymn.key && (
            <span>
              Key: <span className="font-semibold">{hymn.key}</span>
            </span>
          )}
        </div>
      </header>

      {/* Hymn Lyrics Section */}
      <section className="pt-6 sm:pt-8" aria-label="Hymn Lyrics">
        {hymn.verses.map((verse, index) => (
          <React.Fragment key={verse.number}>
            <Verse
              verse={verse}
              textSizeClass={activeSizeClass}
              isSerif={isSerif}
            />

            {/* If chorus is present, show after verse 1 */}
            {hymn.chorus && index === 0 && (
              <Chorus
                lines={hymn.chorus}
                textSizeClass={activeSizeClass}
                isSerif={isSerif}
              />
            )}
          </React.Fragment>
        ))}

        {/* Doxological conclusion / Amen */}
        <div className="text-center pt-8 pb-4">
          <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-[var(--accent-gold)] uppercase select-none">
            Amen
          </span>
        </div>
      </section>
    </article>
  );
};
