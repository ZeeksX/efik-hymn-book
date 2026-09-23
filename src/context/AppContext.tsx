import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReaderSettings, TextSize } from '../types/hymn';
import { storageService } from '../services/storageService';

interface AppContextType {
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;

  // Reader Settings
  readerSettings: ReaderSettings;
  setTextSize: (size: TextSize) => void;
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  resetReaderSettings: () => void;

  // Go to Hymn Dialog Modal
  isGoToHymnOpen: boolean;
  openGoToHymn: () => void;
  closeGoToHymn: () => void;

  // Search History
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    storageService.getRecentlyViewed()
  );
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() =>
    storageService.getReaderSettings()
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    storageService.getRecentSearches()
  );
  const [isGoToHymnOpen, setIsGoToHymnOpen] = useState(false);

  // Favorites
  const toggleFavorite = useCallback((id: string) => {
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.includes(id);
    },
    [favorites]
  );

  // Recently Viewed
  const addRecentlyViewed = useCallback((id: string) => {
    const updated = storageService.addRecentlyViewed(id);
    setRecentlyViewed(updated);
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    storageService.clearRecentlyViewed();
    setRecentlyViewed([]);
  }, []);

  // Reader Settings
  const updateReaderSettings = useCallback((settings: Partial<ReaderSettings>) => {
    const updated = storageService.saveReaderSettings(settings);
    setReaderSettings(updated);
  }, []);

  const setTextSize = useCallback(
    (size: TextSize) => {
      updateReaderSettings({ textSize: size });
    },
    [updateReaderSettings]
  );

  const resetReaderSettings = useCallback(() => {
    const defaultVal = storageService.resetSettings();
    setReaderSettings(defaultVal);
  }, []);

  // Go to Hymn modal state
  const openGoToHymn = useCallback(() => setIsGoToHymnOpen(true), []);
  const closeGoToHymn = useCallback(() => setIsGoToHymnOpen(false), []);

  // Keyboard shortcut for quick hymn search / go to hymn (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGoToHymnOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsGoToHymnOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Searches
  const addRecentSearch = useCallback((query: string) => {
    const updated = storageService.addRecentSearch(query);
    setRecentSearches(updated);
  }, []);

  const clearRecentSearches = useCallback(() => {
    storageService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        readerSettings,
        setTextSize,
        updateReaderSettings,
        resetReaderSettings,
        isGoToHymnOpen,
        openGoToHymn,
        closeGoToHymn,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
