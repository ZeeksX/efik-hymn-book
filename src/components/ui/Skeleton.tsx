import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`rounded-md bg-surface-secondary animate-pulse ${className}`} aria-hidden />
);

interface SkeletonGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  children,
  className = '',
  label = 'Loading content',
}) => (
  <div className={className} role="status" aria-label={label}>
    {children}
  </div>
);

/* -------- Hymn list rows (predictable layout) -------- */
export const HymnListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <SkeletonGroup className="space-y-2" label="Loading hymns">
    <div className="rounded-[14px] border border-border bg-surface p-4 divide-y divide-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3.5">
          <Skeleton className="w-10 h-7 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-6 h-6 rounded-md" />
        </div>
      ))}
    </div>
  </SkeletonGroup>
);

/* -------- Hymn reader (title + verses) -------- */
export const HymnReaderSkeleton: React.FC = () => (
  <SkeletonGroup className="max-w-[760px] mx-auto py-8 space-y-8" label="Loading hymn">
    <div className="space-y-3 text-center">
      <Skeleton className="h-10 w-16 mx-auto rounded-lg" />
      <Skeleton className="h-8 w-2/3 mx-auto" />
      <Skeleton className="h-4 w-1/3 mx-auto" />
    </div>
    <div className="space-y-10 pt-6">
      {[1, 2, 3].map((v) => (
        <div key={v} className="flex gap-6">
          <Skeleton className="w-6 h-5" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-3/6" />
          </div>
        </div>
      ))}
    </div>
  </SkeletonGroup>
);

/* -------- Dashboard metric cards -------- */
export const MetricSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-hidden>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-5 rounded-[14px] border border-border bg-surface space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

/* -------- Admin table -------- */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <SkeletonGroup className="rounded-[14px] border border-border bg-surface overflow-hidden" label="Loading table">
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  </SkeletonGroup>
);
