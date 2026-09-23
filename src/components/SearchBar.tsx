import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  value?: string;
  onSearchChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  autoFocus?: boolean;
  size?: 'normal' | 'large';
  placeholder?: string;
  showGoToShortcut?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearchChange,
  onSubmit,
  autoFocus = false,
  size = 'normal',
  placeholder = 'Search number, title or lyrics...',
  showGoToShortcut = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { openGoToHymn, addRecentSearch } = useApp();
  const internalState = useState(value ?? '');
  const [query, setQuery] = internalState;

  // Controlled when both value + onSearchChange are provided
  const isControlled = value !== undefined && onSearchChange !== undefined;
  const current = isControlled ? value : query;
  const setCurrent = (val: string) => {
    if (isControlled) {
      onSearchChange(val);
    } else {
      setQuery(val);
    }
  };

  const searchId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = current.trim();
    if (onSubmit) {
      onSubmit(trimmed);
      return;
    }
    if (!trimmed) return;
    addRecentSearch(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    if (!isControlled) setQuery('');
  };

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`} role="search">
      <div className="relative w-full flex items-center">
        <span className="absolute left-3.5 sm:left-4 text-subtle-foreground pointer-events-none">
          <Search size={isLarge ? 20 : 17} />
        </span>

        <input
          id={searchId}
          type="search"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search hymns"
          className={`w-full rounded-[12px] border bg-surface text-foreground placeholder:text-subtle-foreground transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${
            isLarge
              ? 'h-13 sm:h-14 pl-11 sm:pl-12 pr-24 sm:pr-28 text-base sm:text-lg'
              : 'h-11 pl-10 pr-24 text-sm'
          } border-border focus:border-primary`}
        />

        {/* Clear + Go to # */}
        <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5">
          {current && (
            <button
              type="button"
              onClick={() => setCurrent('')}
              aria-label="Clear search"
              className="p-1.5 rounded-md text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
            >
              <X size={15} />
            </button>
          )}
          {showGoToShortcut && (
            <button
              type="button"
              onClick={openGoToHymn}
              title="Go to specific hymn number"
              aria-label="Go to Hymn dialog"
              className="hidden sm:inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-semibold bg-surface-secondary hover:bg-border text-accent border border-border transition-colors focus-ring"
            >
              <Hash size={12} />
              <span>Go to #</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
