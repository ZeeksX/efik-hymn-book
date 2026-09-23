import React, { useState } from 'react';
import { Monitor, Moon, Sun, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui';
import { Button, ConfirmDialog } from '../components/ui';
import type { TextSize, ThemeMode } from '../types/hymn';

/* ---------------- Switch ---------------- */
const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 focus-ring ${
      checked ? 'bg-primary' : 'bg-border-strong'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

/* ---------------- Segmented control ---------------- */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string; icon?: React.ElementType }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-[10px] bg-surface-secondary border border-border"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors focus-ring ${
              isActive
                ? 'bg-surface text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {Icon && <Icon size={14} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export const SettingsPage: React.FC = () => {
  const { readerSettings, updateReaderSettings, setTextSize, resetReaderSettings, clearRecentlyViewed } = useApp();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { favorites, toggleFavorite } = useApp();

  const [confirmClear, setConfirmClear] = useState<'history' | 'favorites' | null>(null);

  const textSizes: { id: TextSize; label: string; desc: string }[] = [
    { id: 'sm', label: 'Small', desc: '17px' },
    { id: 'md', label: 'Medium', desc: '19px' },
    { id: 'lg', label: 'Large', desc: '22px' },
    { id: 'xl', label: 'Extra Large', desc: '26px' },
  ];

  const handleReset = () => {
    resetReaderSettings();
    setTheme('system');
    toast('Preferences reset to default', 'info');
  };

  const handleClearFavorites = () => {
    favorites.forEach((id) => toggleFavorite(id));
    toast('All favourites cleared', 'info');
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
    title,
    children,
    className = '',
  }) => (
    <section className={`p-5 sm:p-6 rounded-[14px] border border-border bg-surface space-y-4 ${className}`}>
      <h2 className="text-h3 font-serif text-foreground">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalise your reading experience.
        </p>
      </div>

      {/* Reading */}
      <Section title="Reading">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Text Size</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {textSizes.map((s) => {
              const isSelected = readerSettings.textSize === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTextSize(s.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-[10px] border text-left transition-colors focus-ring ${
                    isSelected
                      ? 'border-primary bg-primary-soft'
                      : 'border-border bg-input-bg hover:bg-surface-secondary'
                  }`}
                >
                  <span className={`block font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {s.label}
                  </span>
                  <span className="block text-[11px] text-subtle-foreground mt-0.5 tabular-nums">{s.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm font-medium text-foreground">Show Verse Numbers</p>
            <p className="text-xs text-muted-foreground mt-0.5">Display numbers beside each verse.</p>
          </div>
          <Switch
            checked={readerSettings.showVerseNumbers}
            onChange={(v) => updateReaderSettings({ showVerseNumbers: v })}
            label="Show verse numbers"
          />
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm font-medium text-foreground">Keep Screen Awake</p>
            <p className="text-xs text-muted-foreground mt-0.5">Prevents the screen dimming while reading in church.</p>
          </div>
          <Switch
            checked={readerSettings.keepScreenAwake}
            onChange={(v) => updateReaderSettings({ keepScreenAwake: v })}
            label="Keep screen awake"
          />
        </div>

        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm font-medium text-foreground">Serif Lyrics</p>
            <p className="text-xs text-muted-foreground mt-0.5">Traditional book serif for hymn text.</p>
          </div>
          <Switch
            checked={readerSettings.serifLyrics}
            onChange={(v) => updateReaderSettings({ serifLyrics: v })}
            label="Use serif lyrics"
          />
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Theme</p>
          <Segmented
            ariaLabel="Theme"
            value={theme}
            onChange={(v: ThemeMode) => setTheme(v)}
            options={[
              { id: 'light' as ThemeMode, label: 'Light', icon: Sun },
              { id: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
              { id: 'system' as ThemeMode, label: 'System', icon: Monitor },
            ]}
          />
        </div>
      </Section>

      {/* Data */}
      <Section title="Data" className="!border-danger/25">
        <p className="text-xs text-muted-foreground -mt-2">
          These actions permanently remove data stored on this device.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setConfirmClear('history')}>
            Clear Recently Viewed
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmClear('favorites')}>
            Clear Local Favourites
          </Button>
        </div>
      </Section>

      {/* Reset */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw size={14} />
          Reset All Preferences
        </Button>
      </div>

      <ConfirmDialog
        open={confirmClear === 'history'}
        onClose={() => setConfirmClear(null)}
        onConfirm={() => {
          clearRecentlyViewed();
          toast('Recently viewed cleared', 'info');
        }}
        title="Clear Recently Viewed?"
        message="This removes your reading history from this device. Favourites and settings are not affected."
        confirmLabel="Clear History"
        destructive
      />
      <ConfirmDialog
        open={confirmClear === 'favorites'}
        onClose={() => setConfirmClear(null)}
        onConfirm={handleClearFavorites}
        title="Clear Local Favourites?"
        message="This removes all saved favourites from this device. This cannot be undone."
        confirmLabel="Clear Favourites"
        destructive
      />
    </div>
  );
};
