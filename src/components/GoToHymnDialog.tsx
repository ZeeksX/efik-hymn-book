import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, CornerDownLeft } from 'lucide-react';
import { Modal, Button } from './ui';
import { useApp } from '../context/AppContext';
import { hymnService } from '../services/hymnService';

export const GoToHymnDialog: React.FC = () => {
  const { isGoToHymnOpen, closeGoToHymn } = useApp();

  // Mount a fresh inner form on every open so the input starts empty
  // without resetting state inside an effect.
  if (!isGoToHymnOpen) return null;
  return <GoToHymnDialogInner onClose={closeGoToHymn} />;
};

const GoToHymnDialogInner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [hymnNumberInput, setHymnNumberInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const parsedNumber = parseInt(hymnNumberInput, 10);

  const previewHymn = useMemo(
    () => (!isNaN(parsedNumber) ? hymnService.getHymnByNumber(parsedNumber) : undefined),
    [parsedNumber]
  );

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      setErrorMessage('Please enter a valid hymn number.');
      return;
    }
    const hymn = hymnService.getHymnByNumber(parsedNumber);
    if (!hymn) {
      setErrorMessage(`Hymn ${parsedNumber} was not found in this edition.`);
      return;
    }
    onClose();
    navigate(`/hymns/${hymn.id}`);
  };

  const press = (digit: string) => {
    setErrorMessage('');
    setHymnNumberInput((prev) => (prev + digit).slice(0, 3));
  };

  const keypadBtn =
    'h-11 rounded-[10px] text-base font-mono font-semibold bg-surface-secondary hover:bg-border text-foreground transition-colors active:bg-border-strong focus-ring';

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Go to Hymn"
      description="Enter hymn number"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hymnNumberInput.trim()} className="min-w-[120px]">
            <span>Open Hymn</span>
            <CornerDownLeft size={15} />
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="hymn-number-input" className="sr-only">
          Hymn number
        </label>
        <input
          id="hymn-number-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoFocus
          placeholder="000"
          aria-invalid={Boolean(errorMessage)}
          value={hymnNumberInput}
          onChange={(e) => {
            setHymnNumberInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 3));
            setErrorMessage('');
          }}
          className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em] h-14 rounded-[10px] border-2 border-border-strong bg-input-bg text-foreground placeholder:text-border-strong focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
        />

        {/* Live match preview */}
        <div className="min-h-[44px] mt-3" aria-live="polite">
          {previewHymn ? (
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-primary-soft border border-primary-soft-border">
              <span className="text-xs font-semibold text-primary truncate">{previewHymn.title}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70 shrink-0">
                {previewHymn.category.split('&')[0].trim()}
              </span>
            </div>
          ) : errorMessage ? (
            <p className="text-xs text-danger flex items-center gap-1.5 px-1" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        {/* Optional keypad — genuinely fast on touch devices */}
        <div className="mt-3 grid grid-cols-3 gap-2" aria-label="Numeric keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => press(digit)}
              className={keypadBtn}
            >
              {digit}
            </button>
          ))}
          <button type="button" onClick={() => setHymnNumberInput('')} className={`${keypadBtn} !text-xs !font-sans font-semibold uppercase tracking-wider`}>
            Clear
          </button>
          <button type="button" onClick={() => press('0')} className={keypadBtn}>
            0
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setHymnNumberInput((prev) => prev.slice(0, -1));
            }}
            className={keypadBtn}
            aria-label="Backspace"
          >
            <Delete size={16} className="mx-auto" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
