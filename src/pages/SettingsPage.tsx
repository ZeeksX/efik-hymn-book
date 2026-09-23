import React, { useState } from 'react';
import { Settings, Sun, Moon, Monitor, RotateCcw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import type { TextSize, ThemeMode } from '../types/hymn';

export const SettingsPage: React.FC = () => {
  const { readerSettings, updateReaderSettings, resetReaderSettings, setTextSize } = useApp();
  const { theme, setTheme } = useTheme();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetReaderSettings();
    setTheme('system');
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  const textSizes: { id: TextSize; label: string; desc: string }[] = [
    { id: 'sm', label: 'Small', desc: '16px compact' },
    { id: 'md', label: 'Medium', desc: '19px standard' },
    { id: 'lg', label: 'Large', desc: '22px generous' },
    { id: 'xl', label: 'Extra Large', desc: '26px extra clear' },
  ];

  const themes: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
    { id: 'light', label: 'Light (Parchment)', icon: Sun },
    { id: 'dark', label: 'Dark (Charcoal)', icon: Moon },
    { id: 'system', label: 'System Default', icon: Monitor },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <Settings size={14} />
          <span>Preferences</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Application Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Customize your reading experience, font sizing, and visual theme.
        </p>
      </div>

      {/* Reading Text Size */}
      <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Hymn Lyrics Size
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Choose a comfortable text scale for standing in church or reading at home.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {textSizes.map((s) => {
            const isSelected = readerSettings.textSize === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setTextSize(s.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                }`}
              >
                <span className="block font-semibold text-sm">{s.label}</span>
                <span className="block text-[11px] opacity-70 mt-0.5">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Typography Style */}
      <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Lyrics Font Style
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Switch between traditional book serif (Lora) and clean sans-serif (Manrope).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateReaderSettings({ serifLyrics: true })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              readerSettings.serifLyrics
                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
            }`}
          >
            <span className="font-serif font-bold text-base block">Serif (Traditional Hymnal)</span>
            <span className="font-serif italic text-xs text-[var(--text-secondary)] mt-1 block">
              "Abasi Ibom Andikpon Nkan..."
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateReaderSettings({ serifLyrics: false })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              !readerSettings.serifLyrics
                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
            }`}
          >
            <span className="font-sans font-bold text-base block">Sans-Serif (Modern Editorial)</span>
            <span className="font-sans text-xs text-[var(--text-secondary)] mt-1 block">
              "Abasi Ibom Andikpon Nkan..."
            </span>
          </button>
        </div>
      </section>

      {/* Appearance / Theme */}
      <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <div>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Appearance
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Select between warm ivory parchment, deep ecclesiastical dark mode, or system default.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'} />
                <span className="text-xs sm:text-sm">{t.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Keep Screen Awake during reading */}
      <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-base font-bold text-[var(--text-primary)]">
            Keep Screen Awake During Hymn Reading
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Prevents the device screen from dimming while reading lyrics during church service.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={readerSettings.keepScreenAwake}
            onChange={(e) => updateReaderSettings({ keepScreenAwake: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-hidden rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
        </label>
      </section>

      {/* Reset Preferences */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:border-red-400 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset All Preferences</span>
        </button>

        {resetDone && (
          <span className="text-xs text-[var(--color-success)] flex items-center gap-1 animate-in fade-in">
            <Check size={14} />
            <span>Preferences reset to default</span>
          </span>
        )}
      </div>
    </div>
  );
};
