import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  FolderTree,
  FileEdit,
  Users,
  Volume2,
  BarChart3,
  Settings,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  ArrowLeft,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'hymns' | 'categories' | 'corrections' | 'users' | 'audio' | 'analytics' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [correctionsCount, setCorrectionsCount] = useState(3);
  const [correctionsList, setCorrectionsList] = useState([
    {
      id: 'c-1',
      hymnNumber: '42',
      hymnTitle: 'Abasi Mmi',
      detail: 'Add diacritic to "døk" in verse 1 line 4 ("Ke døk ukpem nto nye")',
      submittedBy: 'Elder E. Henshaw',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 'c-2',
      hymnNumber: '7',
      hymnTitle: 'Únò isùng',
      detail: 'Capitalize "Andinyanga" in second stanza chorus line',
      submittedBy: 'Choir Leader Asuquo',
      time: '6 hours ago',
      status: 'pending',
    },
    {
      id: 'c-3',
      hymnNumber: '18',
      hymnTitle: 'Abasi Nto',
      detail: 'Verify alternate English title with Presbyterian 1928 hymnal edition',
      submittedBy: 'Rev. Dr. Bassey',
      time: '1 day ago',
      status: 'pending',
    },
  ]);

  const handleApproveCorrection = (id: string) => {
    setCorrectionsList((prev) => prev.filter((c) => c.id !== id));
    setCorrectionsCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6 min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)]">
      {/* Dark Green Left Sidebar Navigation matching Screen 8 */}
      <aside className="w-full md:w-64 bg-[#11271A] text-white flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-gold)] text-[#11271A] flex items-center justify-center font-bold">
              <BookOpen size={18} />
            </div>
            <span className="font-serif font-bold text-base tracking-tight text-white">
              Efik Hymn Book
            </span>
          </Link>
        </div>

        {/* Navigation List matching Screen 8 */}
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'dashboard'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hymns')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'hymns'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen size={18} />
            <span>Hymns</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'categories'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FolderTree size={18} />
            <span>Categories</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corrections')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'corrections'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileEdit size={18} />
              <span>Corrections</span>
            </div>
            {correctionsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-black">
                {correctionsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'users'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users size={18} />
            <span>Users</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'audio'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Volume2 size={18} />
            <span>Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'analytics'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
              activeTab === 'settings'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Return to Public Hymnal */}
        <div className="p-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Public App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8">
        {/* Top Header matching Screen 8 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {activeTab === 'dashboard'
                ? 'Dashboard'
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {activeTab === 'dashboard'
                ? 'Overview of your hymn book'
                : `Manage ${activeTab} across the digital hymnal edition.`}
            </p>
          </div>

          {/* Admin Avatar Dropdown Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold flex items-center justify-center">
                AD
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Admin
              </span>
              <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
            </div>
          </div>
        </div>

        {/* 4 Stat KPI Cards matching Screen 8 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: 350 Total Hymns */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                350
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)] font-medium">
                Total Hymns
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#EBF7EE] text-[#1E7238] flex items-center justify-center dark:bg-[#1C2E22] dark:text-[#6BD88E]">
              <BookOpen size={20} />
            </div>
          </div>

          {/* Card 2: 12 Pending Corrections */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                {correctionsCount + 9}
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)] font-medium">
                Pending Corrections
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] text-[#B45309] flex items-center justify-center dark:bg-[#332617] dark:text-[#FCD34D]">
              <FileEdit size={20} />
            </div>
          </div>

          {/* Card 3: 1,248 Registered Users */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                1,248
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)] font-medium">
                Registered Users
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center dark:bg-[#1E293B] dark:text-[#93C5FD]">
              <Users size={20} />
            </div>
          </div>

          {/* Card 4: 24 Categories */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--text-primary)]">
                24
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)] font-medium">
                Categories
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center dark:bg-[#2A223E] dark:text-[#C4B5FD]">
              <FolderTree size={20} />
            </div>
          </div>
        </div>

        {/* Recent Activity Section matching Screen 8 */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {/* Activity 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-amber-950 dark:text-amber-300">
                  <FileEdit size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    New correction submitted
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Hymn 42 verse 1 diacritic suggestion
                  </p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">2 hours ago</span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-800 flex items-center justify-center dark:bg-green-950 dark:text-green-300">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    Hymn 42 updated
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Added English devotional verse translation
                  </p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">5 hours ago</span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center dark:bg-blue-950 dark:text-blue-300">
                  <UserCheck size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    New user registered
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Mary Asuquo from Calabar assembly
                  </p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">1 day ago</span>
            </div>

            {/* Activity 4 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-elevated)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center dark:bg-purple-950 dark:text-purple-300">
                  <FolderTree size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    Category 'Easter' created
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    Added 14 resurrection hymns
                  </p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">2 days ago</span>
            </div>
          </div>
        </section>

        {/* Pending Corrections Review Table */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
              Pending Corrections Review
            </h2>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {correctionsList.length} requiring verification
            </span>
          </div>

          {correctionsList.length > 0 ? (
            <div className="divide-y divide-[var(--border-subtle)]">
              {correctionsList.map((c) => (
                <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                      Hymn {c.hymnNumber}: {c.hymnTitle}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {c.detail}
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">
                      Submitted by {c.submittedBy} • {c.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproveCorrection(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-primary-hover)] transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveCorrection(c.id)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-tertiary)]">
              All submitted corrections have been reviewed.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};
