import React from 'react';
import { Volume2 } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FilterBar } from '../../components/admin/FilterBar';
import { EmptyState } from '../../components/ui';

export const AdminAudioPage: React.FC = () => {
  return (
    <>
      <AdminPageHeader title="Audio" description="Manage hymn recordings." />

      <FilterBar className="mb-4">
        <input
          disabled
          placeholder="Filter by hymn…"
          aria-label="Filter by hymn"
          className="flex-1 h-10 px-3.5 rounded-[10px] border border-border bg-input-bg text-sm text-foreground placeholder:text-subtle-foreground opacity-60 cursor-not-allowed"
        />
        <input
          disabled
          placeholder="Recording type…"
          aria-label="Recording type"
          className="sm:w-44 h-10 px-3.5 rounded-[10px] border border-border bg-input-bg text-sm text-foreground placeholder:text-subtle-foreground opacity-60 cursor-not-allowed"
        />
        <input
          disabled
          placeholder="Status…"
          aria-label="Status"
          className="sm:w-40 h-10 px-3.5 rounded-[10px] border border-border bg-input-bg text-sm text-foreground placeholder:text-subtle-foreground opacity-60 cursor-not-allowed"
        />
      </FilterBar>

      {/* Intentional empty state — audio management is not yet connected to a backend */}
      <EmptyState
        icon={Volume2}
        title="No recordings yet"
        description="Hymn audio management is coming soon. When recordings are added, they will appear here with processing status and playback controls."
        compact
      />
    </>
  );
};
