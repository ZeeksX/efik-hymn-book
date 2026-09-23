import React from 'react';
import type { TextSize } from '../../types/hymn';
import { useApp } from '../../context/AppContext';

export const FontSizeControl: React.FC = () => {
  const { readerSettings, setTextSize } = useApp();

  const sizes: { key: TextSize; label: string; textClass: string }[] = [
    { key: 'sm', label: 'A-', textClass: 'text-xs' },
    { key: 'md', label: 'A', textClass: 'text-sm font-medium' },
    { key: 'lg', label: 'A+', textClass: 'text-base font-semibold' },
    { key: 'xl', label: 'A++', textClass: 'text-lg font-bold' },
  ];

  return (
    <div
      className="inline-flex items-center p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]"
      role="group"
      aria-label="Adjust hymn text size"
    >
      {sizes.map((s) => {
        const isActive = readerSettings.textSize === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => setTextSize(s.key)}
            aria-pressed={isActive}
            title={`Font size ${s.key.toUpperCase()}`}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer select-none ${s.textClass} ${
              isActive
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs font-bold'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};
