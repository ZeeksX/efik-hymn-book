import React from 'react';
import { Link } from 'react-router-dom';

interface BrandMarkProps {
  /** Show the wordmark + organizational line next to the logo */
  showText?: boolean;
  /** One-line compact variant (default) or stacked with organizational line */
  variant?: 'compact' | 'full';
  className?: string;
  logoClassName?: string;
}

/**
 * Official Rehoboth Assembly identity lockup.
 * Logo: public/rehoboth-logo.jpg — never stretched, rotated or recolored.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  showText = true,
  variant = 'compact',
  className = '',
  logoClassName = 'h-9 w-9',
}) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 shrink-0 focus-ring rounded-lg ${className}`}
      aria-label="Rehoboth Assembly Hymn Book Home"
    >
      <img
        src="/rehoboth-logo.jpg"
        alt="Rehoboth Assembly logo"
        className={`${logoClassName} rounded-lg object-cover shadow-xs`}
        width={72}
        height={72}
        loading="eager"
        decoding="async"
      />
      {showText && (
        <span className="min-w-0">
          <span className="block font-serif font-bold text-sm sm:text-base tracking-tight text-foreground leading-tight">
            Rehoboth Assembly
          </span>
          {variant === 'full' ? (
            <span className="block text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
              Hymn Book · Ñwed Ikwọ Efik
            </span>
          ) : (
            <span className="hidden sm:block text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
              Hymn Book
            </span>
          )}
        </span>
      )}
    </Link>
  );
};
