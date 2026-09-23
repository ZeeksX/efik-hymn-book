import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Heart, Smartphone, Download, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/hymns');
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6">
      {/* Scenic Serene Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-[#EFE8DC]/80 via-[#F7F3EB] to-[var(--bg-main)] dark:from-[#18231C] dark:via-[#141C16] dark:to-[var(--bg-main)] transition-colors">
        {/* Decorative calm mist & palm silhouettes */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-15 flex justify-between items-end overflow-hidden">
          <svg className="w-48 sm:w-72 h-auto text-[var(--brand-primary)] -mb-4 -ml-6" viewBox="0 0 200 200" fill="currentColor">
            {/* Elegant palm & foliage silhouette representing Cross River landscape */}
            <path d="M20 200 C30 140 60 90 120 70 C90 90 70 120 60 200 Z" opacity="0.6"/>
            <path d="M120 70 C150 40 190 30 200 40 C170 60 140 70 120 70 Z" />
            <path d="M120 70 C140 90 170 110 190 120 C160 110 130 90 120 70 Z" />
            <path d="M120 70 C100 50 80 20 70 10 C80 30 100 60 120 70 Z" />
            <path d="M10 200 Q 80 160 140 120 Q 90 150 20 200 Z" opacity="0.4"/>
          </svg>
          <svg className="w-56 sm:w-80 h-auto text-[var(--brand-primary)] -mb-4 -mr-8 hidden sm:block" viewBox="0 0 200 200" fill="currentColor">
            <path d="M180 200 C170 140 140 90 80 70 C110 90 130 120 140 200 Z" opacity="0.6"/>
            <path d="M80 70 C50 40 10 30 0 40 C30 60 60 70 80 70 Z" />
            <path d="M80 70 C60 90 30 110 10 120 C40 110 70 90 80 70 Z" />
            <path d="M80 70 C100 50 120 20 130 10 C120 30 100 60 80 70 Z" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Spaced Uppercase Eyebrow */}
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[var(--text-secondary)] opacity-85 mb-3 sm:mb-4">
            PRAISE • WORSHIP • OUR HERITAGE
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
            Efik Hymn Book
          </h1>

          {/* Tagline */}
          <p className="mt-3 text-lg sm:text-xl font-medium text-[var(--text-primary)] opacity-90">
            Timeless hymns. Lasting faith. Always with you.
          </p>

          {/* Subtitle Description */}
          <p className="mt-2 text-xs sm:text-sm md:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Explore a rich collection of Efik hymns, search by number, title or lyrics, save your favourites, and stay connected to our heritage.
          </p>

          {/* Floating Search Input Card with dark green Search button */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-1.5 sm:p-2 shadow-lg focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20 transition-all"
            >
              <div className="pl-3 sm:pl-4 text-[var(--text-tertiary)] shrink-0">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by hymn number, title or lyrics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm md:text-base bg-transparent border-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* 4 Feature Benefit Highlights Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {/* 1. Browse Hymns */}
            <Link
              to="/hymns"
              className="group p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]/80 hover:border-[var(--brand-primary)]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--brand-primary)] mb-2.5 transition-transform group-hover:scale-105">
                <BookOpen size={24} />
              </div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                Browse Hymns
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                Access the complete hymn collection
              </p>
            </Link>

            {/* 2. Save Favourites */}
            <Link
              to="/favorites"
              className="group p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]/80 hover:border-[var(--brand-primary)]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--brand-primary)] mb-2.5 transition-transform group-hover:scale-105">
                <Heart size={24} />
              </div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                Save Favourites
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                Keep your favourite hymns close
              </p>
            </Link>

            {/* 3. Sync Across Devices */}
            <button
              type="button"
              onClick={openAuthModal}
              className="group p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]/80 hover:border-[var(--brand-primary)]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center cursor-pointer text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--brand-primary)] mb-2.5 transition-transform group-hover:scale-105">
                <Smartphone size={24} />
              </div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                Sync Across Devices
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                Your hymns, anywhere you go
              </p>
            </button>

            {/* 4. Offline Access */}
            <Link
              to="/about"
              className="group p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]/80 hover:border-[var(--brand-primary)]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--brand-primary)] mb-2.5 transition-transform group-hover:scale-105">
                <Download size={24} />
              </div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                Offline Access
              </h3>
              <p className="mt-1 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                Available on any device even offline
              </p>
            </Link>
          </div>

          {/* Concluding Scripture Quotation */}
          <div className="mt-12 sm:mt-16 pt-6 border-t border-[var(--border-subtle)]/60">
            <blockquote className="font-serif italic text-base sm:text-lg text-[var(--text-primary)] opacity-80">
              "Let everything that has breath praise the Lord."
            </blockquote>
            <cite className="block not-italic text-xs font-semibold text-[var(--text-secondary)] mt-1 tracking-wider uppercase">
              Psalm 150:6
            </cite>
          </div>
        </div>
      </section>
    </div>
  );
};
