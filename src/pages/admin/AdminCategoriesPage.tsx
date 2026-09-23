import React, { useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable } from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import { Button, Dropdown, DropdownItem, Input, Textarea, Modal, ConfirmDialog, useToast } from '../../components/ui';
import { adminService } from '../../services/adminService';
import type { AdminCategory } from '../../services/adminService';

export const AdminCategoriesPage: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>(() => adminService.getAdminCategories());
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({ name: '', description: '' });

  const dependentHymns = useMemo(() => {
    if (!deleting) return 0;
    return adminService.getAdminHymns().filter(
      (h) => h.category.toLowerCase().includes(deleting.name.toLowerCase())
    ).length;
  }, [deleting]);

  const openCreate = () => {
    setForm({ name: '', description: '' });
    setFormError('');
    setCreating(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setForm({ name: cat.name, description: cat.description });
    setFormError('');
    setEditing(cat);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setFormError('');
    // Local optimistic update — replaced by adminService call when a backend exists.
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name: form.name.trim(), description: form.description.trim() } : c))
      );
      toast('Category updated', 'success');
      setEditing(null);
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: form.name.toLowerCase().replace(/\s+/g, '-'),
          slug: form.name.toLowerCase().replace(/\s+/g, '-'),
          name: form.name.trim(),
          description: form.description.trim(),
          hymnCount: 0,
          order: prev.length + 1,
          updatedAt: new Date().toISOString(),
        },
      ]);
      toast('Category created', 'success');
      setCreating(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setCategories((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
    toast('Category deleted', 'info');
    setDeleting(null);
  };

  const columns: Column<AdminCategory>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <div>
          <p className="font-serif font-semibold text-foreground">{c.name}</p>
          <p className="text-xs text-subtle-foreground line-clamp-1 hidden sm:block">{c.description}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', hideOnMobile: true, render: (c) => <span className="font-mono text-xs text-muted-foreground">{c.slug}</span> },
    { key: 'count', header: 'Hymns', render: (c) => <span className="text-sm tabular-nums text-foreground">{c.hymnCount}</span> },
    { key: 'order', header: 'Order', hideOnMobile: true, render: (c) => <span className="text-sm tabular-nums text-muted-foreground">{c.order}</span> },
    { key: 'updated', header: 'Updated', hideOnMobile: true, render: (c) => <span className="text-xs text-subtle-foreground">{new Date(c.updatedAt).toLocaleDateString()}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => {
        const index = categories.findIndex((x) => x.id === c.id);
        return (
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label={`Actions for ${c.name}`}
                className="p-1.5 rounded-lg text-subtle-foreground hover:text-foreground hover:bg-surface-secondary transition-colors focus-ring"
              >
                <MoreHorizontal size={16} />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem icon={<Pencil />} onClick={() => { close(); openEdit(c); }}>
                  Edit
                </DropdownItem>
                <DropdownItem icon={<ChevronUp />} onClick={() => { close(); move(index, -1); }}>
                  Move up
                </DropdownItem>
                <DropdownItem icon={<ChevronDown />} onClick={() => { close(); move(index, 1); }}>
                  Move down
                </DropdownItem>
                <DropdownItem icon={<Trash2 />} danger onClick={() => { close(); setDeleting(c); }}>
                  Delete
                </DropdownItem>
              </>
            )}
          </Dropdown>
        );
      },
    },
  ];

  const modalOpen = creating || Boolean(editing);

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Organise hymns by worship context."
        actions={
          <Button onClick={openCreate}>
            <Plus size={15} />
            Add Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={categories}
        rowKey={(c) => c.id}
        emptyState={
          <div className="p-10 text-center text-sm text-muted-foreground">No categories yet.</div>
        }
      />

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Category'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setFormError(''); }}
            error={formError || undefined}
            placeholder="e.g. Dedication"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Short description shown on the category page…"
            rows={3}
          />
        </div>
      </Modal>

      {/* Delete confirmation — warns when hymns depend on the category */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete category?"
        message={
          dependentHymns > 0
            ? `"${deleting?.name}" contains ${dependentHymns} hymn${dependentHymns === 1 ? '' : 's'}. Deleting it will leave those hymns uncategorised. This cannot be undone.`
            : `Delete "${deleting?.name}"? This cannot be undone.`
        }
        confirmLabel="Delete Category"
        destructive
      />
    </>
  );
};
