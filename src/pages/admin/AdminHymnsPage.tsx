import React, { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, Pencil, Eye, UploadCloud, Archive, ArchiveRestore, Search } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable } from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import { Dropdown, DropdownItem, DropdownSeparator, Select, Pagination, EmptyState, StatusBadge, useToast } from '../../components/ui';
import { adminService } from '../../services/adminService';
import type { AdminHymn, ContentStatus } from '../../services/adminService';
import { formatHymnNumber } from '../../utils/formatters';

const PAGE_SIZE = 12;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...adminService.getAdminCategories().map((c) => ({ value: c.slug, label: c.name })),
];

const SORT_OPTIONS = [
  { value: 'num-asc', label: 'Number (ascending)' },
  { value: 'num-desc', label: 'Number (descending)' },
  { value: 'updated-desc', label: 'Recently updated' },
];

export const AdminHymnsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const query = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? 'all';
  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'num-asc';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'all' || (key === 'sort' && value === 'num-asc')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const [version, setVersion] = useState(0);

  const allHymns = useMemo(
    () => adminService.getAdminHymns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = CATEGORY_OPTIONS.find((c) => c.value === category);
    return allHymns
      .filter((h) => {
        if (q && !String(h.number).includes(q) && !h.title.toLowerCase().includes(q)) return false;
        if (status !== 'all' && h.status !== status) return false;
        if (cat && cat.value !== 'all' && !h.category.toLowerCase().includes(cat.label.toLowerCase()))
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'num-desc') return b.number - a.number;
        if (sort === 'updated-desc') return b.updatedAt.localeCompare(a.updatedAt);
        return a.number - b.number;
      });
  }, [allHymns, query, status, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateStatus = (hymn: AdminHymn, next: ContentStatus, message: string) => {
    adminService.setStatus(hymn.id, next);
    setVersion((v) => v + 1);
    toast(message, 'success');
  };

  const columns: Column<AdminHymn>[] = [
    {
      key: 'number',
      header: '#',
      render: (h) => (
        <span className="font-mono text-xs font-bold text-accent tabular-nums">
          {formatHymnNumber(h.number)}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (h) => (
        <div className="min-w-0">
          <p className="font-serif font-semibold text-foreground truncate">{h.title}</p>
          {h.alternateTitle && (
            <p className="text-xs text-subtle-foreground truncate hidden sm:block">{h.alternateTitle}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      hideOnMobile: true,
      render: (h) => <span className="text-xs text-muted-foreground">{h.category.split('&')[0].trim()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (h) => <StatusBadge status={h.status} />,
    },
    {
      key: 'updated',
      header: 'Updated',
      hideOnMobile: true,
      render: (h) => (
        <span className="text-xs text-subtle-foreground">
          {new Date(h.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (h) => (
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label={`Actions for hymn ${h.number}`}
              className="p-1.5 rounded-lg text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
            >
              <MoreHorizontal size={16} />
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem icon={<Pencil />} onClick={() => { close(); navigate(`/admin/hymns/${h.id}`); }}>
                Edit
              </DropdownItem>
              <DropdownItem icon={<Eye />} onClick={() => { close(); navigate(`/hymns/${h.id}`); }}>
                Preview
              </DropdownItem>
              <DropdownSeparator />
              {h.status === 'published' ? (
                <DropdownItem icon={<ArchiveRestore />} onClick={() => { close(); updateStatus(h, 'draft', `Hymn ${h.number} unpublished`); }}>
                  Unpublish
                </DropdownItem>
              ) : (
                <DropdownItem icon={<UploadCloud />} onClick={() => { close(); updateStatus(h, 'published', `Hymn ${h.number} published`); }}>
                  Publish
                </DropdownItem>
              )}
              <DropdownItem
                icon={<Archive />}
                danger={h.status !== 'archived'}
                onClick={() => {
                  close();
                  updateStatus(h, h.status === 'archived' ? 'draft' : 'archived', h.status === 'archived' ? `Hymn ${h.number} restored to draft` : `Hymn ${h.number} archived`);
                }}
              >
                {h.status === 'archived' ? 'Restore' : 'Archive'}
              </DropdownItem>
            </>
          )}
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Hymns"
        description="Manage the hymn collection."
        actions={
          <Link
            to="/admin/hymns/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-semibold transition-colors focus-ring"
          >
            <Plus size={15} />
            Add Hymn
          </Link>
        }
      />

      <FilterBar className="mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setParam('q', e.target.value)}
            placeholder="Search by number or title..."
            aria-label="Search hymns"
            className="w-full h-10 pl-9 pr-3.5 rounded-[10px] border border-border bg-input-bg text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => setParam('status', e.target.value)} options={STATUS_OPTIONS} className="sm:w-40" />
        <Select aria-label="Filter by category" value={category} onChange={(e) => setParam('category', e.target.value)} options={CATEGORY_OPTIONS} className="sm:w-44" />
        <Select aria-label="Sort hymns" value={sort} onChange={(e) => setParam('sort', e.target.value)} options={SORT_OPTIONS} className="sm:w-48" />
      </FilterBar>

      <p className="text-xs text-muted-foreground mb-3" aria-live="polite">
        <strong className="text-foreground tabular-nums">{filtered.length}</strong> hymns
      </p>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(h) => h.id}
        onRowClick={(h) => navigate(`/admin/hymns/${h.id}`)}
        emptyState={
          <EmptyState
            icon={Search}
            title="No hymns found"
            description="No hymns match the current filters. Adjust the search or clear the filters."
            actionLabel="Clear filters"
            actionTo="/admin/hymns"
            compact
          />
        }
      />

      <div className="flex items-center justify-between gap-3 mt-4">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={(p) => {
            setParam('page', String(p));
            window.scrollTo({ top: 0 });
          }}
        />
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>
    </>
  );
};
