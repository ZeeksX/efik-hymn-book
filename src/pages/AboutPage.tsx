import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Input, Textarea, Button } from '../components/ui';
import { correctionService } from '../services/correctionService';

export const AboutPage: React.FC = () => {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [correctionText, setCorrectionText] = useState('');
  const [hymnNumber, setHymnNumber] = useState('');
  const [formError, setFormError] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) {
      setFormError('Please describe the correction before submitting.');
      return;
    }
    correctionService.submit(
      hymnNumber ? parseInt(hymnNumber, 10) : undefined,
      correctionText
    );
    setReportSubmitted(true);
    setCorrectionText('');
    setHymnNumber('');
    setFormError('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-h1 text-foreground">About This Hymn Book</h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          The Rehoboth Assembly digital edition of the beloved hymns of the Efik-speaking
          congregations of Nigeria and the diaspora.
        </p>
      </header>

      {/* Purpose */}
      <section className="space-y-3">
        <h2 className="text-h2 text-foreground">Our Purpose</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The <em className="text-foreground">Ñwed Ikwọ Efik</em> has served generations of
          believers in churches, homes, and choir practices across Calabar, Akwa Ibom, Cross River,
          and beyond. This digital edition — prepared for Rehoboth Assembly, Great-Ilasa District —
          keeps these hymns instantly accessible on any phone, tablet, or desktop, even without
          connectivity once cached.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Every screen is designed with reverence, legibility, and simplicity, so that young
          worshippers and elderly elders alike can reach any hymn within seconds.
        </p>
      </section>

      <hr className="border-border" />

      {/* How to use */}
      <section className="space-y-4">
        <h2 className="text-h2 text-foreground">How to Use</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
          <div>
            <dt className="font-semibold text-foreground font-serif">Go to Hymn</dt>
            <dd className="mt-1 text-muted-foreground leading-relaxed">
              Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded border border-border bg-surface-secondary">Ctrl K</kbd> or the
              “Go to Hymn” button anywhere, type the number, and open.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground font-serif">Adjust reading size</dt>
            <dd className="mt-1 text-muted-foreground leading-relaxed">
              Use the reader toolbar (A− / A+) on any hymn, or set a permanent size under Settings.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground font-serif">Church presentation</dt>
            <dd className="mt-1 text-muted-foreground leading-relaxed">
              Open any hymn and choose <span className="font-semibold text-foreground">Presentation Mode</span> to
              project clean, high-contrast lyrics slide by slide.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground font-serif">Favourites & history</dt>
            <dd className="mt-1 text-muted-foreground leading-relaxed">
              Tap the heart to save a hymn. Recently viewed hymns are remembered on your device.
            </dd>
          </div>
        </dl>
      </section>

      <hr className="border-border" />

      {/* Acknowledgements */}
      <section className="space-y-3">
        <h2 className="text-h2 text-foreground">Acknowledgements & Sources</h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The hymn texts are drawn from the hymnal tradition of the Presbyterian Church of
          Nigeria, the Qua Iboe Church, the Methodist Church, and other Protestant assemblies along
          the Cross River basin. We honour the translators, indigenous linguists, choir directors,
          and ministers who preserved this spiritual heritage.
        </p>
        <p className="text-xs text-subtle-foreground">
          Content is made available for worship and devotional use. Hymn texts remain the property
          of their respective rights holders where applicable.
        </p>
      </section>

      <hr className="border-border" />

      {/* Report a correction */}
      <section className="space-y-4">
        <h2 className="text-h2 text-foreground">Report a Correction</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Spotted a typo, a missing diacritic (ñ, ọ, ẹ), or a verse discrepancy? Let us know so the
          text stays faithfully accurate.
        </p>

        {reportSubmitted ? (
          <div className="flex items-center gap-2.5 p-4 rounded-[12px] bg-success-soft border border-success/25 text-success text-sm">
            <CheckCircle size={19} className="shrink-0" />
            <span>Thank you — your correction has been recorded for review.</span>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-3.5 max-w-xl">
            <Input
              label="Hymn number (optional)"
              inputMode="numeric"
              placeholder="e.g. 42"
              value={hymnNumber}
              onChange={(e) => setHymnNumber(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <Textarea
              label="Correction details"
              required
              placeholder="Describe the discrepancy or verse correction..."
              value={correctionText}
              onChange={(e) => {
                setCorrectionText(e.target.value);
                setFormError('');
              }}
              error={formError || undefined}
            />
            <Button type="submit">Submit Correction</Button>
          </form>
        )}
      </section>
    </div>
  );
};
