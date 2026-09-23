import React from 'react';

type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-secondary text-muted-foreground border-border',
  primary: 'bg-primary-soft text-primary border-primary-soft-border',
  success: 'bg-success-soft text-success border-success/25',
  warning: 'bg-warning-soft text-warning border-warning/25',
  danger: 'bg-danger-soft text-danger border-danger/25',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  dot = false,
  className = '',
  children,
  ...rest
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${toneClasses[tone]} ${className}`}
      {...rest}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
};

/** Status → tone mapping used by admin tables */
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className = '',
}) => {
  const normalized = status.toLowerCase();
  const map: Record<string, BadgeTone> = {
    published: 'success',
    ready: 'success',
    active: 'success',
    accepted: 'success',
    draft: 'neutral',
    reviewing: 'warning',
    pending: 'warning',
    processing: 'warning',
    rejected: 'danger',
    failed: 'danger',
    suspended: 'danger',
    archived: 'neutral',
  };
  return (
    <Badge tone={map[normalized] ?? 'neutral'} dot className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
