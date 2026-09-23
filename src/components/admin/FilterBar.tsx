import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2.5 ${className}`} role="group" aria-label="Filters">
      {children}
    </div>
  );
};
