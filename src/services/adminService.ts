import { hymnService } from './hymnService';
import { CATEGORIES } from '../data/categories';
import type { Hymn } from '../types/hymn';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ContentStatus = 'published' | 'draft' | 'archived';
export type CorrectionStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';
export type CorrectionType = 'lyrics' | 'title' | 'translation' | 'other';
export type UserRole = 'user' | 'editor' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type AudioType = 'vocal' | 'choir' | 'instrumental';
export type AudioStatus = 'processing' | 'ready' | 'failed';

export interface AdminHymn extends Hymn {
  status: ContentStatus;
  updatedAt: string; // ISO date
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  hymnCount: number;
  order: number;
  updatedAt: string;
}

export interface Correction {
  id: string;
  hymnId: string;
  hymnNumber: number;
  hymnTitle: string;
  type: CorrectionType;
  currentText: string;
  suggestedText: string;
  message?: string;
  submittedBy: string;
  submittedAt: string;
  status: CorrectionStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

export interface AudioRecording {
  id: string;
  hymnId: string;
  hymnNumber: number;
  hymnTitle: string;
  title: string;
  type: AudioType;
  duration: string;
  status: AudioStatus;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalHymns: number;
  published: number;
  drafts: number;
  pendingCorrections: number;
  users: number;
  categories: number;
}

/* ------------------------------------------------------------------ */
/* Local dataset — replaced by API calls when a backend is connected.  */
/* All admin components consume only these types + this service.       */
/* ------------------------------------------------------------------ */

const STATUS_KEY = 'efik_hymns_admin_statuses';
const CORRECTIONS_SEED_KEY = 'efik_hymns_admin_corrections_seen';

function loadStatuses(): Record<string, ContentStatus> {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStatuses(statuses: Record<string, ContentStatus>): void {
  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
  } catch {
    // storage unavailable
  }
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_CORRECTIONS: Correction[] = [
  {
    id: 'corr-1',
    hymnId: '42',
    hymnNumber: 42,
    hymnTitle: 'Abasi Mmi',
    type: 'lyrics',
    currentText: 'Ke dok ukpem nto nye',
    suggestedText: 'Ke dọk ukpem nto nye',
    message: 'Missing diacritic on "dọk" in verse 1, line 4 — it should carry the middle dot.',
    submittedBy: 'Elder E. Henshaw',
    submittedAt: daysAgo(0),
    status: 'pending',
  },
  {
    id: 'corr-2',
    hymnId: '7',
    hymnNumber: 7,
    hymnTitle: 'Únò isùng',
    type: 'title',
    currentText: 'Andinyanga',
    suggestedText: 'Andinyangá',
    message: 'Capitalisation and tonal mark on the second stanza chorus line.',
    submittedBy: 'Choir Leader Asuquo',
    submittedAt: daysAgo(1),
    status: 'pending',
  },
  {
    id: 'corr-3',
    hymnId: '18',
    hymnNumber: 18,
    hymnTitle: 'Abasi Nto',
    type: 'translation',
    currentText: 'The Lord is my rock',
    suggestedText: 'The Lord is my refuge and strength',
    message: 'Alternate English title should match the Presbyterian 1928 edition.',
    submittedBy: 'Rev. Dr. Bassey',
    submittedAt: daysAgo(2),
    status: 'reviewing',
  },
  {
    id: 'corr-4',
    hymnId: '23',
    hymnNumber: 23,
    hymnTitle: 'Ikwọ mbufo',
    type: 'other',
    currentText: '—',
    suggestedText: '—',
    message: 'Verse 3 appears to be missing from the printed edition; please verify against the source hymnal.',
    submittedBy: 'Mary Asuquo',
    submittedAt: daysAgo(3),
    status: 'pending',
  },
];

const SEED_USERS: AdminUser[] = [
  { id: 'usr-1', name: 'Church Admin', email: 'admin@efikhymns.org', role: 'admin', status: 'active', joinedAt: daysAgo(420) },
  { id: 'usr-2', name: 'Deaconess Ekaette', email: 'ekaette@efikhymns.org', role: 'editor', status: 'active', joinedAt: daysAgo(210) },
  { id: 'usr-3', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active', joinedAt: daysAgo(64) },
  { id: 'usr-4', name: 'Mary Asuquo', email: 'mary.asuquo@example.com', role: 'user', status: 'active', joinedAt: daysAgo(12) },
  { id: 'usr-5', name: 'Choir Leader Asuquo', email: 'choir.asuquo@example.com', role: 'user', status: 'suspended', joinedAt: daysAgo(88) },
  { id: 'usr-6', name: 'Rev. Dr. Bassey', email: 'bassey@efikhymns.org', role: 'editor', status: 'active', joinedAt: daysAgo(300) },
  { id: 'usr-7', name: 'Elder E. Henshaw', email: 'henshaw@efikhymns.org', role: 'user', status: 'active', joinedAt: daysAgo(150) },
];

/* ------------------------------------------------------------------ */

export const adminService = {
  /* ---------------- Dashboard ---------------- */

  getDashboardMetrics(): DashboardMetrics {
    const all = hymnService.getAllHymns();
    const statuses = loadStatuses();
    const drafts = all.filter((h) => (statuses[h.id] ?? 'published') === 'draft').length;
    return {
      totalHymns: all.length,
      published: all.length - drafts,
      drafts,
      pendingCorrections: this.getCorrections().filter((c) => c.status === 'pending').length,
      users: SEED_USERS.length,
      categories: CATEGORIES.length,
    };
  },

  getRecentActivity(): { id: string; label: string; detail: string; time: string }[] {
    return [
      { id: 'act-1', label: 'New correction submitted', detail: 'Hymn 42 — verse 1 diacritic suggestion', time: '2 hours ago' },
      { id: 'act-2', label: 'Hymn 42 updated', detail: 'Added English devotional verse translation', time: '5 hours ago' },
      { id: 'act-3', label: 'New user registered', detail: 'Mary Asuquo from Calabar assembly', time: '1 day ago' },
      { id: 'act-4', label: "Category 'Easter' updated", detail: 'Order adjusted for the Easter season', time: '2 days ago' },
    ];
  },

  getRecentlyEdited(): AdminHymn[] {
    const numbers = [42, 7, 18, 128, 1];
    return numbers
      .map((n) => hymnService.getHymnByNumber(n))
      .filter((h): h is Hymn => Boolean(h))
      .map((h) => this.toAdminHymn(h));
  },

  /* ---------------- Hymns ---------------- */

  toAdminHymn(hymn: Hymn): AdminHymn {
    const statuses = loadStatuses();
    return {
      ...hymn,
      status: statuses[hymn.id] ?? 'published',
      updatedAt: daysAgo((hymn.number % 30) + 1),
    };
  },

  getAdminHymns(): AdminHymn[] {
    return hymnService.getAllHymns().map((h) => this.toAdminHymn(h));
  },

  setStatus(hymnId: string, status: ContentStatus): void {
    const statuses = loadStatuses();
    statuses[hymnId] = status;
    saveStatuses(statuses);
  },

  /* ---------------- Categories ---------------- */

  getAdminCategories(): AdminCategory[] {
    return CATEGORIES.map((cat, i) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      hymnCount: cat.hymnCount ?? 0,
      order: i + 1,
      updatedAt: daysAgo(i + 2),
    }));
  },

  /* ---------------- Corrections ---------------- */

  getCorrections(): Correction[] {
    try {
      const seen = localStorage.getItem(CORRECTIONS_SEED_KEY);
      if (seen) {
        const stored = JSON.parse(seen) as Correction[];
        if (Array.isArray(stored)) return stored;
      }
    } catch {
      // fall through to seed
    }
    return SEED_CORRECTIONS;
  },

  saveCorrections(corrections: Correction[]): void {
    try {
      localStorage.setItem(CORRECTIONS_SEED_KEY, JSON.stringify(corrections));
    } catch {
      // storage unavailable
    }
  },

  updateCorrectionStatus(id: string, status: CorrectionStatus): Correction[] {
    const updated = this.getCorrections().map((c) =>
      c.id === id ? { ...c, status } : c
    );
    this.saveCorrections(updated);
    return updated;
  },

  /* ---------------- Users ---------------- */

  getAdminUsers(): AdminUser[] {
    return SEED_USERS;
  },

  /* ---------------- Audio (future-ready) ---------------- */

  getAudioRecordings(): AudioRecording[] {
    return [];
  },
};
