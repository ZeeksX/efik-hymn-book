import type { ReaderSettings, TextSize, ThemeMode } from '../types/hymn';

const FAVORITES_KEY = 'efik_hymns_favorites';
const RECENTLY_VIEWED_KEY = 'efik_hymns_recently_viewed';
const RECENT_SEARCHES_KEY = 'efik_hymns_recent_searches';
const SETTINGS_KEY = 'efik_hymns_reader_settings';
const THEME_KEY = 'efik_hymns_theme';

const DEFAULT_SETTINGS: ReaderSettings = {
  textSize: 'md',
  keepScreenAwake: false,
  serifLyrics: false,
};

export const storageService = {
  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  },

  toggleFavorite(id: string): string[] {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(id);
    let updated: string[];
    if (index > -1) {
      updated = favorites.filter((fId) => fId !== id);
    } else {
      updated = [id, ...favorites];
    }
    this.saveFavorites(updated);
    return updated;
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  // Favourites (bulk)
  clearFavorites(): void {
    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (e) {
      console.error('Failed to clear favorites', e);
    }
  },

  // Recently Viewed
  getRecentlyViewed(): string[] {
    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentlyViewed(id: string): string[] {
    try {
      const recents = this.getRecentlyViewed().filter((item) => item !== id);
      const updated = [id, ...recents].slice(0, 12);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearRecentlyViewed(): void {
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (e) {
      console.error('Failed to clear recently viewed', e);
    }
  },

  // Recent Searches
  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(RECENT_SEARCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentSearch(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getRecentSearches();
    try {
      const current = this.getRecentSearches().filter(
        (q) => q.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...current].slice(0, 12);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches', e);
    }
  },

  // Reader Settings
  getReaderSettings(): ReaderSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveReaderSettings(settings: Partial<ReaderSettings>): ReaderSettings {
    try {
      const current = this.getReaderSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  setTextSize(size: TextSize): ReaderSettings {
    return this.saveReaderSettings({ textSize: size });
  },

  resetSettings(): ReaderSettings {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  // Theme
  getTheme(): ThemeMode {
    try {
      const theme = localStorage.getItem(THEME_KEY) as ThemeMode;
      return theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system';
    } catch {
      return 'system';
    }
  },

  saveTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },
};
