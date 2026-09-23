import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Eye, UploadCloud, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Input, Textarea, Select, Button, Badge, useToast } from '../../components/ui';
import { hymnService } from '../../services/hymnService';
import { adminService } from '../../services/adminService';
import type { ContentStatus } from '../../services/adminService';
import type { Hymn, HymnVerse } from '../../types/hymn';

type SaveState = 'saved' | 'unsaved' | 'saving' | 'error';

const CATEGORY_OPTIONS = adminService.getAdminCategories().map((c) => ({
  value: c.name,
  label: c.name,
}));

const blankVerse = (number: number): HymnVerse => ({ number, lines: [''] });

export const HymnEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id;

  const existing = useMemo(() => {
    if (!id) return undefined;
    return adminService.getHymnDraft(id) ?? hymnService.getHymnById(id) ?? hymnService.getHymnByNumber(parseInt(id, 10));
  }, [id]);

  const [form, setForm] = useState<Hymn>(() => ({
    id: existing?.id ?? `new-${Date.now()}`,
    number: existing?.number ?? 0,
    title: existing?.title ?? '',
    alternateTitle: existing?.alternateTitle ?? '',
    category: existing?.category ?? 'Praise',
    verses: existing?.verses?.length ? existing.verses : [blankVerse(1)],
    chorus: existing?.chorus,
    tags: existing?.tags,
    author: existing?.author,
  }));
  const [status, setStatus] = useState<ContentStatus>(() =>
    isNew ? 'draft' : adminService.getAdminHymns().find((h) => h.id === id)?.status ?? 'draft'
  );
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const saveTimer = useRef<number | null>(null);

  /* ----- Save timer cleanup ----- */
  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const persist = (nextStatus: ContentStatus) => {
    setSaveState('saving');
    // Simulated async save — swap for hymnService API call when a backend exists.
    saveTimer.current = window.setTimeout(() => {
      try {
        adminService.saveHymnDraft(form, nextStatus);
        setStatus(nextStatus);
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 450);
  };

  /* ----- Verse operations ----- */
  const updateVerse = (index: number, linesText: string) => {
    setForm((prev) => {
      const verses = [...prev.verses];
      verses[index] = { ...verses[index], lines: linesText.split('\n') };
      return { ...prev, verses };
    });
    setSaveState('unsaved');
  };

  const addVerse = () => {
    setForm((prev) => ({ ...prev, verses: [...prev.verses, blankVerse(prev.verses.length + 1)] }));
    setSaveState('unsaved');
  };

  const removeVerse = (index: number) => {
    setForm((prev) => ({
      ...prev,
      verses: prev.verses
        .filter((_, i) => i !== index)
        .map((v, i) => ({ ...v, number: i + 1 })),
    }));
    setSaveState('unsaved');
  };

  const moveVerse = (index: number, dir: -1 | 1) => {
    setForm((prev) => {
      const verses = [...prev.verses];
      const target = index + dir;
      if (target < 0 || target >= verses.length) return prev;
      [verses[index], verses[target]] = [verses[target], verses[index]];
      return { ...prev, verses: verses.map((v, i) => ({ ...v, number: i + 1 })) };
    });
    setSaveState('unsaved');
  };

  const handlePreview = () => {
    if (existing) {
      navigate(`/hymns/${existing.id}`);
    } else {
      toast('Save the hymn first to preview it', 'info');
    }
  };

  const saveStateView = {
    saved: (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
        <Check size={14} /> Saved
      </span>
    ),
    unsaved: <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning">Unsaved changes</span>,
    saving: (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    ),
    error: (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-danger">
        <AlertCircle size={14} /> Error saving
      </span>
    ),
  }[saveState];

  const inputCls =
    'w-full h-10 rounded-[10px] border border-border bg-input-bg px-3.5 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors';

  return (
    <>
      {/* Editor header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <Link
            to="/admin/hymns"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md mb-1"
          >
            <ArrowLeft size={15} />
            Back to Hymns
          </Link>
          <h1 className="text-h1 text-foreground truncate">
            {isNew ? 'Add Hymn' : `Hymn ${existing?.number ?? (form.number || '—')}`}
          </h1>
          <div className="mt-1.5 flex items-center gap-3">
            {saveStateView}
            <Badge tone={status === 'published' ? 'success' : status === 'archived' ? 'neutral' : 'primary'}>
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button variant="ghost" onClick={handlePreview}>
            <Eye size={15} />
            Preview
          </Button>
          <Button variant="secondary" onClick={() => persist(status)} loading={saveState === 'saving'}>
            Save Draft
          </Button>
          <Button
            onClick={() => {
              persist('published');
              toast('Hymn published', 'success');
            }}
            loading={saveState === 'saving'}
            disabled={form.title.trim() === '' || form.number <= 0}
          >
            <UploadCloud size={15} />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main editor column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Numbering + titles */}
          <section className="p-5 rounded-[14px] border border-border bg-surface space-y-4">
            <h2 className="text-h3 font-serif text-foreground">Hymn Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Hymn number"
                inputMode="numeric"
                value={form.number || ''}
                onChange={(e) => {
                  setForm((p) => ({ ...p, number: parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0 }));
                  setSaveState('unsaved');
                }}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Efik title"
                  value={form.title}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value }));
                    setSaveState('unsaved');
                  }}
                  placeholder="e.g. Abasi Mmi"
                />
              </div>
            </div>
            <Input
              label="Alternate (English) title"
              value={form.alternateTitle ?? ''}
              onChange={(e) => {
                setForm((p) => ({ ...p, alternateTitle: e.target.value }));
                setSaveState('unsaved');
              }}
              placeholder="e.g. My God and King"
            />
          </section>

          {/* Verses */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-serif text-foreground">Verses</h2>
              <Button variant="secondary" size="sm" onClick={addVerse}>
                <Plus size={14} />
                Add Verse
              </Button>
            </div>

            {form.verses.map((verse, index) => (
              <div key={index} className="p-4 sm:p-5 rounded-[14px] border border-border bg-surface space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-subtle-foreground">
                    Verse {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveVerse(index, -1)}
                      disabled={index === 0}
                      aria-label="Move verse up"
                      className="p-1.5 rounded-md text-subtle-foreground hover:text-foreground hover:bg-surface-secondary disabled:opacity-30 disabled:pointer-events-none focus-ring"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveVerse(index, 1)}
                      disabled={index === form.verses.length - 1}
                      aria-label="Move verse down"
                      className="p-1.5 rounded-md text-subtle-foreground hover:text-foreground hover:bg-surface-secondary disabled:opacity-30 disabled:pointer-events-none focus-ring"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeVerse(index)}
                      disabled={form.verses.length === 1}
                      aria-label="Delete verse"
                      className="p-1.5 rounded-md text-subtle-foreground hover:text-danger hover:bg-danger-soft disabled:opacity-30 disabled:pointer-events-none focus-ring"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <Textarea
                  aria-label={`Verse ${index + 1} lyrics`}
                  value={verse.lines.join('\n')}
                  onChange={(e) => updateVerse(index, e.target.value)}
                  rows={5}
                  placeholder={'One lyric line per line…'}
                />
              </div>
            ))}

            {/* Chorus — clearly separated */}
            <div className="p-4 sm:p-5 rounded-[14px] border border-accent/40 bg-surface space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Chorus · Nsinsi</span>
              </div>
              <Textarea
                aria-label="Chorus lyrics"
                value={(form.chorus ?? []).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter((l, i, arr) => !(l === '' && i === arr.length - 1));
                  setForm((p) => ({ ...p, chorus: lines.length ? lines : undefined }));
                  setSaveState('unsaved');
                }}
                rows={4}
                placeholder={'One chorus line per line…'}
              />
            </div>
          </section>
        </div>

        {/* Metadata sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="p-5 rounded-[14px] border border-border bg-surface space-y-4">
            <h2 className="text-h3 font-serif text-foreground">Metadata</h2>
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => {
                setForm((p) => ({ ...p, category: e.target.value }));
                setSaveState('unsaved');
              }}
              options={CATEGORY_OPTIONS}
            />
            <Input
              label="Author"
              value={form.author ?? ''}
              onChange={(e) => {
                setForm((p) => ({ ...p, author: e.target.value }));
                setSaveState('unsaved');
              }}
              placeholder="e.g. Rev. J. B. Ansa"
            />
            <div>
              <label htmlFor="tags-input" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Tags (comma separated)
              </label>
              <input
                id="tags-input"
                value={(form.tags ?? []).join(', ')}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  }));
                  setSaveState('unsaved');
                }}
                className={inputCls}
                placeholder="praise, worship"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Publication status</p>
              <Badge tone={status === 'published' ? 'success' : status === 'archived' ? 'neutral' : 'primary'} dot>
                {status}
              </Badge>
            </div>
          </section>

          {/* Danger zone */}
          {!isNew && (
            <section className="p-5 rounded-[14px] border border-danger/25 bg-surface space-y-3">
              <h2 className="text-h3 font-serif text-foreground">Danger Zone</h2>
              <p className="text-xs text-muted-foreground">
                Archived hymns are hidden from the public app but remain in the collection.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  adminService.setStatus(form.id, 'archived');
                  toast('Hymn archived', 'info');
                  navigate('/admin/hymns');
                }}
              >
                Archive Hymn
              </Button>
            </section>
          )}
        </aside>
      </div>
    </>
  );
};
