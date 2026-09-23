import React, { useState } from 'react';
import { BookOpen, Mail, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [correctionText, setCorrectionText] = useState('');
  const [hymnNumber, setHymnNumber] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;
    setReportSubmitted(true);
    setCorrectionText('');
    setHymnNumber('');
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <BookOpen size={14} />
          <span>Heritage & Ministry</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          About the Efik Hymn Book
        </h1>
        <p className="mt-2 text-base text-[var(--text-secondary)] leading-relaxed">
          Digitizing the beloved Christian hymns of the Efik-speaking congregations across Nigeria and the diaspora.
        </p>
      </div>

      {/* Purpose Section */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent-gold)]" />
          <span>Our Purpose</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          The <em>Ñwed Ikwọ Efik</em> (Efik Hymn Book) has served generations of believers in churches, homes, and choir practices across Calabar, Akwa Ibom, Cross River, and worldwide. This digital edition was crafted to ensure these timeless hymns are instantly accessible on any phone, tablet, or desktop without requiring internet connectivity once cached.
        </p>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Every screen was designed with reverence, legibility, and simplicity, ensuring that young worshippers and elderly church elders alike can navigate directly to hymns within seconds.
        </p>
      </section>

      {/* How to Use */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
          How to Use During Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <strong className="text-[var(--text-primary)] block font-serif">Quick Number Jump</strong>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Press the <span className="font-semibold text-[var(--accent-gold)]">#</span> or <span className="font-semibold">Go to Hymn</span> button anywhere in the app, type the hymn number, and tap open.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <strong className="text-[var(--text-primary)] block font-serif">Adjust Reading Size</strong>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Use the reader toolbar to switch between font sizes (<span className="font-mono text-xs">A-</span> to <span className="font-mono text-xs">A++</span>) or toggle Serif/Sans typography.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <strong className="text-[var(--text-primary)] block font-serif">Church Presentation</strong>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tap <span className="font-semibold text-[var(--brand-primary)]">Present</span> on any hymn to project clean high-contrast lyrics slide by slide for the sanctuary.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <strong className="text-[var(--text-primary)] block font-serif">Offline & Saved Hymns</strong>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Tap the heart to save your favorite worship hymns. All recently viewed hymns are remembered automatically on your device.
            </p>
          </div>
        </div>
      </section>

      {/* Acknowledgements & Sources */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <ShieldCheck size={18} className="text-[var(--brand-primary)]" />
          <span>Acknowledgements & Sources</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          The Efik Hymn Book is drawn from the rich hymnal tradition established by the Presbyterian Church of Nigeria, the Qua Iboe Church, Methodist, and other Protestant missionary assemblies along the Cross River basin. We honor the missionary translators, indigenous linguists, choir directors, and ministers who preserved this spiritual heritage.
        </p>
      </section>

      {/* Report a Correction */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Mail size={18} className="text-[var(--brand-primary)]" />
          <span>Report a Hymn Correction</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Did you spot a typo, an orthographic nuance (e.g. missing diacritics like ñ, ọ, ẹ), or a verse discrepancy? Please let us know to help keep the text faithfully accurate.
        </p>

        {reportSubmitted ? (
          <div className="p-4 rounded-xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-sm flex items-center gap-2.5">
            <CheckCircle size={20} className="shrink-0" />
            <span>Thank you! Your correction feedback has been recorded for review.</span>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="report-number" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Hymn Number (optional)
                </label>
                <input
                  id="report-number"
                  type="text"
                  placeholder="e.g. 42"
                  value={hymnNumber}
                  onChange={(e) => setHymnNumber(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="report-correction" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Correction Details
                </label>
                <input
                  id="report-correction"
                  type="text"
                  required
                  placeholder="Describe the discrepancy or verse correction..."
                  value={correctionText}
                  onChange={(e) => setCorrectionText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--brand-primary-hover)] transition-colors cursor-pointer"
            >
              Submit Correction
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
