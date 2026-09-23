import React, { useState } from 'react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Select, Button, useToast } from '../../components/ui';

export const AdminSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [appName, setAppName] = useState('Efik Hymn Book');
  const [language, setLanguage] = useState('en');
  const [sorting, setSorting] = useState('num-asc');

  const handleSave = () => {
    toast('Settings saved', 'success');
  };

  const labelCls = 'block text-xs font-semibold text-muted-foreground mb-1.5';
  const inputCls =
    'w-full h-10 rounded-[10px] border border-border bg-input-bg px-3.5 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors';

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Application preferences for the public hymnal."
        actions={
          <Button onClick={handleSave}>Save Changes</Button>
        }
      />

      <div className="max-w-2xl space-y-5">
        {/* General */}
        <section className="p-5 rounded-[14px] border border-border bg-surface space-y-4">
          <h2 className="text-h3 font-serif text-foreground">General</h2>
          <div>
            <label htmlFor="app-name" className={labelCls}>Application name</label>
            <input id="app-name" value={appName} onChange={(e) => setAppName(e.target.value)} className={inputCls} />
          </div>
          <Select
            label="Default language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'efik', label: 'Efik' },
            ]}
          />
        </section>

        {/* Content */}
        <section className="p-5 rounded-[14px] border border-border bg-surface space-y-4">
          <h2 className="text-h3 font-serif text-foreground">Content</h2>
          <Select
            label="Default hymn sorting"
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            options={[
              { value: 'num-asc', label: 'Number (ascending)' },
              { value: 'num-desc', label: 'Number (descending)' },
              { value: 'title-asc', label: 'Title (A–Z)' },
            ]}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Content version</span>
            <span className="font-mono text-xs text-subtle-foreground">edition-2024.1</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last content import</span>
            <span className="text-xs text-subtle-foreground">2 June 2024</span>
          </div>
        </section>

        {/* Appearance */}
        <section className="p-5 rounded-[14px] border border-border bg-surface space-y-2">
          <h2 className="text-h3 font-serif text-foreground">Appearance</h2>
          <p className="text-xs text-muted-foreground">
            The admin area follows the same light/dark theme as the public app. Theme preference is
            managed per user under the public <strong className="text-foreground">Settings</strong> page.
          </p>
        </section>
      </div>
    </>
  );
};
