import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  rows = 4,
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
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-[10px] border bg-input-bg text-foreground placeholder:text-subtle-foreground px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
          error ? 'border-danger' : 'border-border'
        } ${className}`}
        {...rest}
      />
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
