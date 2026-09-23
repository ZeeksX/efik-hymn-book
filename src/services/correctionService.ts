import { hymnService } from './hymnService';

export interface SubmittedCorrection {
  hymnNumber?: number;
  message: string;
  submittedAt: string;
}

const CORRECTIONS_KEY = 'efik_hymns_user_corrections';

export const correctionService = {
  submit(hymnNumber: number | undefined, message: string): SubmittedCorrection {
    const entry: SubmittedCorrection = {
      hymnNumber,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(CORRECTIONS_KEY);
      const existing: SubmittedCorrection[] = raw ? JSON.parse(raw) : [];
      existing.unshift(entry);
      localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(existing.slice(0, 30)));
    } catch {
      // storage unavailable — submission still "succeeds" for the session
    }

    return entry;
  },

  /** Attach hymn title if the number matches, for display in the queue. */
  resolveHymn(hymnNumber?: number) {
    if (!hymnNumber) return undefined;
    return hymnService.getHymnByNumber(hymnNumber);
  },
};
