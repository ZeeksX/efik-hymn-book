import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  initialValue?: string;
  onSearchChange?: (val: string) => void;
  autoFocus?: boolean;
  size?: 'normal' | 'large';
  placeholder?: string;
  showGoToShortcut?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearchChange,
  autoFocus = false,
  size = 'normal',
  placeholder = 'Search hymn number, title or lyrics...',
  showGoToShortcut = true,
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const { openGoToHymn, addRecentSearch } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    addRecentSearch(trimmed);

    // If query is pure number, go straight to that hymn if valid or search
    const parsedNum = parseInt(trimmed, 10);
    if (!isNaN(parsedNum) && String(parsedNum) === trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const isLarge = size === 'large';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full ${className}`}
      role="search"
    >
      <div className="relative w-full flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3.5 sm:left-4.5 text-[var(--text-tertiary)] pointer-events-none flex items-center">
          <Search size={isLarge ? 22 : 18} />
        </div>

        {/* Search Input */}
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search hymns"
          className={`w-full rounded-2xl border transition-all duration-200 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-hidden ${
            isLarge
              ? 'py-4 pl-12 pr-28 sm:pr-36 text-base sm:text-lg border-[var(--border-strong)] shadow-xs focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20'
              : 'py-2.5 pl-10 pr-20 text-sm border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20'
          }`}
        />

        {/* Right action tools: Clear button & Go to number shortcut */}
        <div className="absolute right-2.5 sm:right-3.5 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          {showGoToShortcut && (
            <button
              type="button"
              onClick={openGoToHymn}
              title="Go to specific hymn number"
              aria-label="Go to hymn number dialog"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--accent-gold)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <Hash size={13} />
              <span>Go to #</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
