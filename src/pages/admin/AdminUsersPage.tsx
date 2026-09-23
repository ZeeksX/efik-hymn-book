import React, { useMemo, useState } from 'react';
import { MoreHorizontal, Search, Eye, ShieldQuestion, UserX, UserCheck } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FilterBar } from '../../components/admin/FilterBar';
import { DataTable } from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import { Dropdown, DropdownItem, DropdownSeparator, Select, ConfirmDialog, Badge, EmptyState, StatusBadge, useToast } from '../../components/ui';
import { adminService } from '../../services/adminService';
import type { AdminUser, UserRole } from '../../services/adminService';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

export const AdminUsersPage: React.FC = () => {
  const { toast } = useToast();
  const users = useMemo(() => adminService.getAdminUsers(), []);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleChanges, setRoleChanges] = useState<Record<string, UserRole>>({});
  const [statusChanges, setStatusChanges] = useState<Record<string, 'active' | 'suspended'>>({});
  const [confirmSuspend, setConfirmSuspend] = useState<AdminUser | null>(null);

  const resolveRole = (u: AdminUser): UserRole => roleChanges[u.id] ?? u.role;
  const resolveStatus = (u: AdminUser): 'active' | 'suspended' => statusChanges[u.id] ?? u.status;

  const filtered = useMemo(
    () =>
      users
        .map((u) => ({ ...u, role: resolveRole(u), status: resolveStatus(u) }))
        .filter((u) => {
          const q = query.trim().toLowerCase();
          if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
          if (roleFilter !== 'all' && u.role !== roleFilter) return false;
          if (statusFilter !== 'all' && u.status !== statusFilter) return false;
          return true;
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, query, roleFilter, statusFilter, roleChanges, statusChanges]
  );

  const changeRole = (u: AdminUser, role: UserRole) => {
    setRoleChanges((p) => ({ ...p, [u.id]: role }));
    toast(`${u.name} is now ${role === 'admin' ? 'an' : 'a'} ${role}`, 'success');
  };

  const toggleSuspension = (u: AdminUser) => {
    const next = resolveStatus(u) === 'active' ? 'suspended' : 'active';
    setStatusChanges((p) => ({ ...p, [u.id]: next }));
    toast(next === 'suspended' ? `${u.name} suspended` : `${u.name} reactivated`, next === 'suspended' ? 'info' : 'success');
    setConfirmSuspend(null);
  };

  const columns: Column<AdminUser & { status: 'active' | 'suspended' }>[] = [
    {
      key: 'user',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-primary-soft text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
            {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
            <p className="text-xs text-subtle-foreground truncate">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', hideOnMobile: true, render: (u) => <Badge tone={u.role === 'admin' ? 'primary' : 'neutral'}>{u.role}</Badge> },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    {
      key: 'joined',
      header: 'Joined',
      hideOnMobile: true,
      render: (u) => (
        <span className="text-xs text-subtle-foreground">
          {new Date(u.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label={`Actions for ${u.name}`}
              className="p-1.5 rounded-lg text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
            >
              <MoreHorizontal size={16} />
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem icon={<Eye />} onClick={close}>
                View profile
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={<ShieldQuestion />} onClick={() => { close(); changeRole(u, 'editor'); }}>
                Make Editor
              </DropdownItem>
              <DropdownItem icon={<ShieldQuestion />} onClick={() => { close(); changeRole(u, 'admin'); }}>
                Make Admin
              </DropdownItem>
              <DropdownItem icon={<ShieldQuestion />} onClick={() => { close(); changeRole(u, 'user'); }}>
                Make User
              </DropdownItem>
              <DropdownSeparator />
              {u.status === 'active' ? (
                <DropdownItem icon={<UserX />} danger onClick={() => { close(); setConfirmSuspend(u); }}>
                  Suspend
                </DropdownItem>
              ) : (
                <DropdownItem icon={<UserCheck />} onClick={() => { close(); toggleSuspension(u); }}>
                  Reactivate
                </DropdownItem>
              )}
            </>
          )}
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Users" description="Manage accounts, roles and access." />

      <FilterBar className="mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className="w-full h-10 pl-9 pr-3.5 rounded-[10px] border border-border bg-input-bg text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} options={ROLE_OPTIONS} className="sm:w-36" />
        <Select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUS_OPTIONS} className="sm:w-40" />
      </FilterBar>

      <p className="text-xs text-muted-foreground mb-3" aria-live="polite">
        <strong className="text-foreground tabular-nums">{filtered.length}</strong> users
      </p>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(u) => u.id}
        emptyState={
          <EmptyState icon={Search} title="No users found" description="No users match the current search or filters." compact />
        }
      />

      <ConfirmDialog
        open={Boolean(confirmSuspend)}
        onClose={() => setConfirmSuspend(null)}
        onConfirm={() => confirmSuspend && toggleSuspension(confirmSuspend)}
        title={`Suspend ${confirmSuspend?.name ?? 'user'}?`}
        message="Suspended users cannot sign in or sync favourites until reactivated."
        confirmLabel="Suspend User"
        destructive
      />
    </>
  );
};
