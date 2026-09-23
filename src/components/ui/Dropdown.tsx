import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: 'left' | 'right';
  className?: string;
  panelClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
  panelClassName = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className="contents"
      >
        {trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 mt-2 min-w-48 bg-surface border border-border rounded-xl shadow-lg py-1.5 animate-menu-in ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${panelClassName}`}
        >
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  danger?: boolean;
  active?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  danger = false,
  active = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors cursor-pointer focus-ring ${
        danger
          ? 'text-danger hover:bg-danger-soft'
          : active
            ? 'text-primary bg-primary-soft font-semibold'
            : 'text-foreground hover:bg-surface-secondary'
      } ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0 text-subtle-foreground [&>svg]:size-4">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export const DropdownSeparator: React.FC = () => (
  <div className="my-1 border-t border-border" role="separator" />
);
