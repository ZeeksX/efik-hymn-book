import React, { useMemo, useState } from 'react';
import { Check, X, FileEdit } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import { Drawer, Button, StatusBadge, EmptyState, useToast } from '../../components/ui';
import { adminService } from '../../services/adminService';
import type { Correction, CorrectionStatus } from '../../services/adminService';
import { formatHymnNumber } from '../../utils/formatters';

const FILTERS: { id: CorrectionStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'reviewing', label: 'Reviewing' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'rejected', label: 'Rejected' },
];

export const AdminCorrectionsPage: React.FC = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<CorrectionStatus | 'all'>('pending');
  const [corrections, setCorrections] = useState<Correction[]>(() => adminService.getCorrections());
  const [selected, setSelected] = useState<Correction | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? corrections : corrections.filter((c) => c.status === filter)),
    [corrections, filter]
  );

  const setStatus = (id: string, status: CorrectionStatus, message: string) => {
    setCorrections(adminService.updateCorrectionStatus(id, status));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    toast(message, status === 'accepted' ? 'success' : 'info');
  };

  const columns: Column<Correction>[] = [
    {
      key: 'hymn',
      header: 'Hymn',
      render: (c) => (
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold text-accent tabular-nums">{formatHymnNumber(c.hymnNumber)}</p>
          <p className="font-serif text-sm font-semibold text-foreground truncate">{c.hymnTitle}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      hideOnMobile: true,
      render: (c) => <span className="text-xs text-muted-foreground capitalize">{c.type}</span>,
    },
    {
      key: 'submittedBy',
      header: 'Submitted By',
      hideOnMobile: true,
      render: (c) => <span className="text-sm text-foreground">{c.submittedBy}</span>,
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      hideOnMobile: true,
      render: (c) => (
        <span className="text-xs text-subtle-foreground">
          {new Date(c.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Corrections" description="Review hymn corrections submitted by worshippers." />

      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => {
          const count = f.id === 'all' ? corrections.length : corrections.filter((c) => c.status === f.id).length;
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={isActive}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-colors focus-ring ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:text-foreground hover:border-border-strong'
              }`}
            >
              {f.label} <span className="opacity-70 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        onRowClick={setSelected}
        emptyState={
          <EmptyState
            icon={FileEdit}
            title="No corrections here"
            description={
              filter === 'all'
                ? 'There are no submitted corrections yet.'
                : `No ${filter} corrections right now.`
            }
            compact
          />
        }
      />

      {/* Review drawer */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Hymn ${selected ? formatHymnNumber(selected.hymnNumber) : ''} — Correction`}
        footer={
          selected && (selected.status === 'pending' || selected.status === 'reviewing') ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setStatus(selected.id, 'rejected', 'Correction rejected')}
              >
                <X size={15} />
                Reject
              </Button>
              <Button onClick={() => setStatus(selected.id, 'accepted', 'Correction accepted')}>
                <Check size={15} />
                Accept
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-muted-foreground capitalize">{selected.type} correction</span>
            </div>

            {/* Current vs suggested comparison */}
            <div className="space-y-3">
              <div className="p-4 rounded-[12px] border border-border bg-surface-secondary">
                <p className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground mb-1.5">
                  Current text
                </p>
                <p className="font-serif text-sm text-foreground">{selected.currentText}</p>
              </div>
              <div className="p-4 rounded-[12px] border border-primary-soft-border bg-primary-soft/50">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1.5">
                  Suggested text
                </p>
                <p className="font-serif text-sm text-foreground">{selected.suggestedText}</p>
              </div>
            </div>

            {selected.message && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-subtle-foreground mb-1.5">
                  Message from submitter
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selected.message}</p>
              </div>
            )}

            <div className="pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
              <p>Submitted by <strong className="text-foreground">{selected.submittedBy}</strong></p>
              <p>{new Date(selected.submittedAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
