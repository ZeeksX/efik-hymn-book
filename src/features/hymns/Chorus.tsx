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
    <div id="verse-chorus" className="my-8 sm:my-10 pl-5 sm:pl-6 border-l-2 border-accent/50 py-1 scroll-mt-24">
      <span className="block font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-2 select-none">
        Chorus · Nsinsi
      </span>
      <div className={`text-foreground ${textSizeClass} ${isSerif ? 'font-serif' : 'font-sans'}`}>
        {lines.map((line, idx) => (
          <p key={idx} className="hymn-verse-line">
            {line}
          </p>
        ))}

        {englishLines && englishLines.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 text-muted-foreground font-serif italic text-[0.72em] leading-relaxed space-y-1">
            {englishLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
