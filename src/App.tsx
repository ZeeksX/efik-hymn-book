import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui';
import { HymnReaderSkeleton } from './components/ui';

import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';

/* -------- Public pages (eager) -------- */
import { HomePage } from './pages/HomePage';
import { HymnsPage } from './pages/HymnsPage';
import { HymnDetailPage } from './pages/HymnDetailPage';
import { SearchPage } from './pages/SearchPage';

/* -------- Lazy routes: heavy / less-frequent / admin -------- */
const PresentationPage = lazy(() =>
  import('./pages/PresentationPage').then((m) => ({ default: m.PresentationPage }))
);
const CategoriesPage = lazy(() =>
  import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const CategoryDetailPage = lazy(() =>
  import('./pages/CategoryDetailPage').then((m) => ({ default: m.CategoryDetailPage }))
);
const FavoritesPage = lazy(() =>
  import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
);
const HistoryPage = lazy(() =>
  import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminHymnsPage = lazy(() =>
  import('./pages/admin/AdminHymnsPage').then((m) => ({ default: m.AdminHymnsPage }))
);
const HymnEditorPage = lazy(() =>
  import('./pages/admin/HymnEditorPage').then((m) => ({ default: m.HymnEditorPage }))
);
const AdminCategoriesPage = lazy(() =>
  import('./pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminCorrectionsPage = lazy(() =>
  import('./pages/admin/AdminCorrectionsPage').then((m) => ({ default: m.AdminCorrectionsPage }))
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminAudioPage = lazy(() =>
  import('./pages/admin/AdminAudioPage').then((m) => ({ default: m.AdminAudioPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);

function LazyFallback() {
  return (
    <div className="py-10">
      <HymnReaderSkeleton />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Presentation Mode — no application shell */}
                <Route
                  path="/hymns/:id/present"
                  element={
                    <Suspense fallback={<div className="min-h-screen bg-background" />}>
                      <PresentationPage />
                    </Suspense>
                  }
                />

                {/* Admin — guarded inside AdminLayout; never flashed to non-admins */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={
                    <Suspense fallback={<LazyFallback />}><AdminDashboardPage /></Suspense>
                  } />
                  <Route path="hymns" element={
                    <Suspense fallback={<LazyFallback />}><AdminHymnsPage /></Suspense>
                  } />
                  <Route path="hymns/new" element={
                    <Suspense fallback={<LazyFallback />}><HymnEditorPage /></Suspense>
                  } />
                  <Route path="hymns/:id" element={
                    <Suspense fallback={<LazyFallback />}><HymnEditorPage /></Suspense>
                  } />
                  <Route path="categories" element={
                    <Suspense fallback={<LazyFallback />}><AdminCategoriesPage /></Suspense>
                  } />
                  <Route path="corrections" element={
                    <Suspense fallback={<LazyFallback />}><AdminCorrectionsPage /></Suspense>
                  } />
                  <Route path="users" element={
                    <Suspense fallback={<LazyFallback />}><AdminUsersPage /></Suspense>
                  } />
                  <Route path="audio" element={
                    <Suspense fallback={<LazyFallback />}><AdminAudioPage /></Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<LazyFallback />}><AdminSettingsPage /></Suspense>
                  } />
                </Route>

                {/* Public application shell */}
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="hymns" element={<HymnsPage />} />
                  <Route path="hymns/:id" element={<HymnDetailPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route
                    path="categories"
                    element={<Suspense fallback={<LazyFallback />}><CategoriesPage /></Suspense>}
                  />
                  <Route
                    path="categories/:slug"
                    element={<Suspense fallback={<LazyFallback />}><CategoryDetailPage /></Suspense>}
                  />
                  <Route
                    path="favorites"
                    element={<Suspense fallback={<LazyFallback />}><FavoritesPage /></Suspense>}
                  />
                  <Route
                    path="history"
                    element={<Suspense fallback={<LazyFallback />}><HistoryPage /></Suspense>}
                  />
                  <Route
                    path="settings"
                    element={<Suspense fallback={<LazyFallback />}><SettingsPage /></Suspense>}
                  />
                  <Route
                    path="about"
                    element={<Suspense fallback={<LazyFallback />}><AboutPage /></Suspense>}
                  />
                  <Route
                    path="login"
                    element={<Suspense fallback={<LazyFallback />}><LoginPage /></Suspense>}
                  />
                  <Route
                    path="privacy"
                    element={<Suspense fallback={<LazyFallback />}><PrivacyPolicyPage /></Suspense>}
                  />
                  <Route
                    path="terms"
                    element={<Suspense fallback={<LazyFallback />}><TermsPage /></Suspense>}
                  />
                  <Route
                    path="*"
                    element={<Suspense fallback={<LazyFallback />}><NotFoundPage /></Suspense>}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
