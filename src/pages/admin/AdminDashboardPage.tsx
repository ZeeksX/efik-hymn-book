import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileEdit, Users, Grid3X3, CheckCircle2 } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { MetricCard } from '../../components/admin/MetricCard';
import { Badge } from '../../components/ui';
import { adminService } from '../../services/adminService';
import { formatHymnNumber } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const metrics = useMemo(() => adminService.getDashboardMetrics(), []);
  const activity = useMemo(() => adminService.getRecentActivity(), []);
  const recentlyEdited = useMemo(() => adminService.getRecentlyEdited(), []);
  const pendingCorrections = useMemo(
    () => adminService.getCorrections().filter((c) => c.status === 'pending'),
    []
  );

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your hymn book."
        actions={
          <Link
            to="/admin/hymns/new"
            className="inline-flex items-center h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-semibold transition-colors focus-ring"
          >
            Add Hymn
          </Link>
        }
      />

      {/* Primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Hymns" value={metrics.totalHymns} icon={<BookOpen />} />
        <MetricCard label="Published" value={metrics.published} icon={<CheckCircle2 />} />
        <MetricCard label="Drafts" value={metrics.drafts} icon={<FileEdit />} />
        <MetricCard
          label="Pending Corrections"
          value={metrics.pendingCorrections}
          icon={<FileEdit />}
          emphasis={metrics.pendingCorrections > 0}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <MetricCard label="Registered Users" value={metrics.users} icon={<Users />} />
        <MetricCard label="Categories" value={metrics.categories} icon={<Grid3X3 />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Pending corrections */}
        <section aria-labelledby="dash-corrections">
          <div className="flex items-center justify-between mb-3">
            <h2 id="dash-corrections" className="text-h3 font-serif text-foreground">
              Pending Corrections
            </h2>
            <Link to="/admin/corrections" className="text-xs font-semibold text-primary hover:underline focus-ring rounded-sm">
              Review all
            </Link>
          </div>
          <div className="rounded-[14px] border border-border bg-surface divide-y divide-border">
            {pendingCorrections.length > 0 ? (
              pendingCorrections.slice(0, 4).map((c) => (
                <div key={c.id} className="px-4 sm:px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      <span className="font-mono text-accent">Hymn {formatHymnNumber(c.hymnNumber)}</span> · {c.hymnTitle}
                    </p>
                    <Badge tone="warning" dot>Pending</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.message}</p>
                  <p className="mt-1 text-[11px] text-subtle-foreground">
                    {c.submittedBy} · {new Date(c.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <CheckCircle2 size={22} className="mx-auto text-success mb-2" />
                <p className="text-sm text-muted-foreground">All corrections have been reviewed.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent activity */}
        <section aria-labelledby="dash-activity">
          <h2 id="dash-activity" className="text-h3 font-serif text-foreground mb-3">
            Recent Activity
          </h2>
          <div className="rounded-[14px] border border-border bg-surface divide-y divide-border">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className="text-[11px] text-subtle-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Recently edited */}
          <h2 id="dash-edited" className="text-h3 font-serif text-foreground mt-6 mb-3">
            Recently Edited Hymns
          </h2>
          <div className="rounded-[14px] border border-border bg-surface divide-y divide-border">
            {recentlyEdited.map((h) => (
              <Link
                key={h.id}
                to={`/admin/hymns/${h.id}`}
                className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 hover:bg-surface-secondary/50 transition-colors focus-ring"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-accent tabular-nums shrink-0">
                    {formatHymnNumber(h.number)}
                  </span>
                  <span className="font-serif text-sm font-semibold text-foreground truncate">
                    {h.title}
                  </span>
                </div>
                <Badge tone={h.status === 'published' ? 'success' : 'neutral'}>{h.status}</Badge>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
