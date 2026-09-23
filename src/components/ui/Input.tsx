import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leadingIcon,
  trailingSlot,
  inputSize = 'md',
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-[10px] border bg-input-bg text-foreground placeholder:text-subtle-foreground transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-border'
          } ${leadingIcon ? 'pl-9' : 'pl-3.5'} ${trailingSlot ? 'pr-10' : 'pr-3.5'} ${sizeClasses[inputSize]} ${className}`}
          {...rest}
        />
        {trailingSlot && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">{trailingSlot}</span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1" role="alert">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-subtle-foreground">{hint}</p>
      ) : null}
    </div>
  );
};
