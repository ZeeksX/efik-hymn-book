import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  emphasis?: boolean;
  /** Optional link target rendered as a quiet "view" affordance */
  to?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, emphasis = false }) => {
  return (
    <div
      className={`p-5 rounded-[14px] border bg-surface ${
        emphasis ? 'border-primary-soft-border bg-primary-soft/40' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
          <p className="mt-1.5 font-serif text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
            {value}
          </p>
        </div>
        {icon && (
          <span className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-primary-soft text-primary shrink-0 [&>svg]:size-5">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};
