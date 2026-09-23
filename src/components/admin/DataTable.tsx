import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Hide this column entirely on small screens */
  hideOnMobile?: boolean;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyState,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="rounded-[14px] border border-border bg-surface overflow-hidden admin-table-wrap">
      <table className="w-full text-sm admin-table">
        <thead>
          <tr className="bg-surface-secondary/60 border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-subtle-foreground ${alignClass[col.align ?? 'left']} ${
                  col.hideOnMobile ? 'hidden md:table-cell' : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`${
                onRowClick ? 'cursor-pointer' : ''
              } hover:bg-surface-secondary/50 transition-colors`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.header}
                  className={`px-4 sm:px-5 py-3.5 align-middle ${alignClass[col.align ?? 'left']} ${
                    col.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${col.className ?? ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
