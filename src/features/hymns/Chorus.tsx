import React from 'react';

interface ChorusProps {
  lines: string[];
  englishLines?: string[];
  textSizeClass: string;
  isSerif?: boolean;
}

export const Chorus: React.FC<ChorusProps> = ({
  lines,
  englishLines,
  textSizeClass,
  isSerif = true,
}) => {
  return (
    <div id="verse-chorus" className="my-7 sm:my-9 pl-6 sm:pl-8 border-l-2 border-[var(--accent-gold)]/70 py-1 scroll-mt-24">
      <span className="block font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[var(--accent-gold)] mb-2 select-none">
        Chorus / Nsinsi
      </span>
      <div
        className={`text-[var(--text-primary)] font-medium ${textSizeClass} ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
      >
        {lines.map((line, idx) => (
          <p key={idx} className="hymn-verse-line leading-relaxed sm:leading-loose">
            {line}
          </p>
        ))}

        {englishLines && englishLines.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)]/40 text-[var(--text-secondary)] opacity-85 font-serif italic text-sm sm:text-base space-y-1">
            {englishLines.map((line, idx) => (
              <p key={idx} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
