import React from 'react';

interface ChorusProps {
  lines: string[];
  textSizeClass: string;
  isSerif?: boolean;
}

export const Chorus: React.FC<ChorusProps> = ({
  lines,
  textSizeClass,
  isSerif = false,
}) => {
  return (
    <div className="my-7 sm:my-9 pl-6 sm:pl-8 border-l-2 border-[var(--accent-gold)]/70 py-1">
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
      </div>
    </div>
  );
};
