import React from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-primary text-primary-foreground px-3 py-1.5 text-xs flex items-center justify-center gap-2"
    >
      <WifiOff size={14} className="text-accent shrink-0" />
      <span>
        <strong>Offline mode active.</strong> All hymns and saved favourites are available without internet.
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 opacity-80 text-[11px] ml-1">
        <CheckCircle size={12} />
        <span>Cached</span>
      </span>
    </div>
  );
};
