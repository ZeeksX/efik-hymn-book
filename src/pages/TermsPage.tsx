import React from 'react';
import { FileText, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-1">
          <FileText size={14} />
          <span>Terms of Use</span>
        </div>
        <h1 className="text-h1 text-foreground">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: September 2026. Guidelines for using the Rehoboth Assembly Hymn Book application.
        </p>
      </div>

      {/* Permitted Use */}
      <section className="space-y-4">
        <h2 className="text-h2 text-foreground flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          <span>Permitted Use in Church &amp; Devotion</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The Rehoboth Assembly Hymn Book (Ñwed Ikwọ Efik) web application is made freely accessible for:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>Congregational church services and choir rehearsals.</li>
          <li>Personal devotion, family morning/evening prayers, and fellowship meetings.</li>
          <li>Displaying sacred hymn lyrics via Presentation Mode for sanctuary projection.</li>
          <li>Sharing hymn lyrics with fellow worshippers for educational and spiritual encouragement.</li>
        </ul>
      </section>

      {/* Liturgical Heritage */}
      <section className="space-y-3">
        <h2 className="text-h2 text-foreground flex items-center gap-2">
          <CheckCircle size={18} className="text-accent" />
          <span>Liturgical Heritage</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The hymns, meter arrangements, and tunes contained within this digitized collection belong
          to the historical Protestant Christian tradition of the Efik-speaking community. This
          project serves as a non-commercial digital preservation effort honoring the Presbyterian
          Church of Nigeria, Qua Iboe Church, Methodist, and regional Christian assemblies.
        </p>
      </section>

      {/* Text Integrity & Corrections */}
      <section className="space-y-3">
        <h2 className="text-h2 text-foreground">Text Integrity &amp; Corrections</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          While great care is taken to reproduce the authentic orthography, diacritics, verses, and
          choruses of each hymn, typographical discrepancies may occasionally occur. Users are
          welcome to submit corrections through our{' '}
          <Link to="/about" className="text-primary font-semibold hover:underline focus-ring rounded-sm">
            About &amp; Corrections page
          </Link>.
        </p>
      </section>

      {/* Service Availability */}
      <section className="pt-4 border-t border-border space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-subtle-foreground">
          Service Availability
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The application is provided "as is" and "as available". Offline functionality depends on
          device browser support for Progressive Web App caching and local storage.
        </p>
      </section>
    </div>
  );
};
