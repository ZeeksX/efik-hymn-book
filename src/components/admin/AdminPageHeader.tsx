import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-h1 text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
