import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';

export const GoToHymnDialog: React.FC = () => {
  const { isGoToHymnOpen, closeGoToHymn } = useApp();
  const [hymnNumberInput, setHymnNumberInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isGoToHymnOpen) {
      setHymnNumberInput('');
      setErrorMessage('');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isGoToHymnOpen]);

  if (!isGoToHymnOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(hymnNumberInput.trim(), 10);

    if (isNaN(num) || num <= 0) {
      setErrorMessage('Please enter a valid hymn number');
      return;
    }

    const hymn = hymnService.getHymnByNumber(num);
    if (!hymn) {
      setErrorMessage(`Hymn #${num} was not found in the collection.`);
      return;
    }

    closeGoToHymn();
    navigate(`/hymns/${hymn.id}`);
  };

  const handleQuickKeypad = (digit: string) => {
    setErrorMessage('');
    setHymnNumberInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setErrorMessage('');
    setHymnNumberInput((prev) => prev.slice(0, -1));
  };

  // Preview matching hymn if typed
  const previewNumber = parseInt(hymnNumberInput.trim(), 10);
  const previewHymn = !isNaN(previewNumber) ? hymnService.getHymnByNumber(previewNumber) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={closeGoToHymn}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="w-full max-w-sm sm:max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)]/60 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--brand-primary)]">
            <Hash size={20} className="text-[var(--accent-gold)]" />
            <h2 id="dialog-title" className="font-serif text-lg font-bold text-[var(--text-primary)]">
              Go to Hymn Number
            </h2>
          </div>
          <button
            type="button"
            onClick={closeGoToHymn}
            aria-label="Close dialog"
            className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="hymn-number-input" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Enter Hymn Number
          </label>
          <div className="relative">
            <input
              id="hymn-number-input"
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="e.g. 42, 128, 201"
              value={hymnNumberInput}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setHymnNumberInput(val);
                setErrorMessage('');
              }}
              className="w-full text-center text-3xl font-mono font-bold tracking-widest py-3 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Quick Preview of matching hymn */}
          {previewHymn && (
            <div className="mt-3 p-2.5 rounded-lg bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-xs flex items-center justify-between animate-in fade-in">
              <span className="font-semibold truncate">
                {previewHymn.title}
              </span>
              <span className="shrink-0 text-[10px] opacity-80 uppercase tracking-wider ml-2">
                {previewHymn.category}
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-[var(--color-error)] text-xs flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Optional On-Screen Keypad for quick mobile touch */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleQuickKeypad(digit)}
                className="py-2.5 rounded-lg text-lg font-mono font-semibold bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors active:scale-95 cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setHymnNumberInput('')}
              className="py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleQuickKeypad('0')}
              className="py-2.5 rounded-lg text-lg font-mono font-semibold bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors active:scale-95 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Modal Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={closeGoToHymn}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hymnNumberInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <span>Open Hymn</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
