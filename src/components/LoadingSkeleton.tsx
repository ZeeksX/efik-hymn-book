import React from 'react';

interface LoadingSkeletonProps {
  type?: 'list' | 'hymn' | 'categories' | 'card';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'list',
  count = 4,
}) => {
  if (type === 'hymn') {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-pulse space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="h-6 w-24 bg-[var(--border-subtle)] rounded"></div>
          <div className="h-8 w-8 bg-[var(--border-subtle)] rounded-full"></div>
        </div>
        <div className="text-center space-y-3">
          <div className="h-6 w-20 bg-[var(--border-subtle)] rounded mx-auto"></div>
          <div className="h-8 w-3/4 bg-[var(--border-subtle)] rounded mx-auto"></div>
          <div className="h-4 w-32 bg-[var(--border-subtle)] rounded mx-auto"></div>
        </div>
        <div className="pt-10 space-y-8">
          {[1, 2, 3].map((v) => (
            <div key={v} className="space-y-3">
              <div className="h-4 w-8 bg-[var(--border-subtle)] rounded"></div>
              <div className="h-4 w-5/6 bg-[var(--border-subtle)] rounded"></div>
              <div className="h-4 w-4/6 bg-[var(--border-subtle)] rounded"></div>
              <div className="h-4 w-5/6 bg-[var(--border-subtle)] rounded"></div>
              <div className="h-4 w-3/6 bg-[var(--border-subtle)] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'categories') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--border-subtle)]"></div>
            <div className="h-5 w-2/3 bg-[var(--border-subtle)] rounded"></div>
            <div className="h-3 w-5/6 bg-[var(--border-subtle)] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-8 rounded-md bg-[var(--border-subtle)]"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-[var(--border-subtle)] rounded"></div>
              <div className="h-3 w-1/2 bg-[var(--border-subtle)] rounded"></div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--border-subtle)]"></div>
        </div>
      ))}
    </div>
  );
};
