import React from 'react';
import { FileText, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-2">
      {/* Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-widest mb-1">
          <FileText size={14} />
          <span>Terms of Use</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Last updated: September 2026. Guidelines for using the Efik Hymn Book application.
        </p>
      </div>

      {/* Permitted Use */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <BookOpen size={18} className="text-[var(--brand-primary)]" />
          <span>Permitted Use in Church & Devotion</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          The Efik Hymn Book (Ñwed Ikwọ Efik) web application is made freely accessible for:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-secondary)]">
          <li>Congregational church services and choir rehearsals.</li>
          <li>Personal devotion, family morning/evening prayers, and fellowship meetings.</li>
          <li>Displaying sacred hymn lyrics via Presentation Mode for sanctuary projection.</li>
          <li>Sharing hymn lyrics with fellow worshippers for educational and spiritual encouragement.</li>
        </ul>
      </section>

      {/* Intellectual Heritage & Preservation */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <CheckCircle size={18} className="text-[var(--accent-gold)]" />
          <span>Liturgical Heritage</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The hymns, meter arrangements, and tunes contained within this digitized collection belong to the historical Protestant Christian tradition of the Efik-speaking community. This project serves as a non-commercial digital preservation effort honoring the Presbyterian Church of Nigeria, Qua Iboe Church, Methodist, and regional Christian assemblies.
        </p>
      </section>

      {/* Hymn Corrections */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
          Text Integrity & Corrections
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          While great care is taken to reproduce the authentic orthography, diacritics, verses, and choruses of each hymn, typographical discrepancies may occasionally occur. Users are welcome to submit corrections through our <Link to="/about" className="text-[var(--brand-primary)] font-semibold hover:underline">About & Corrections page</Link>.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 text-xs text-[var(--text-tertiary)]">
        <h2 className="font-serif text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Service Availability
        </h2>
        <p className="leading-relaxed">
          The application is provided "as is" and "as available". Offline functionality depends on device browser support for Progressive Web App caching and local storage.
        </p>
      </section>
    </div>
  );
};
