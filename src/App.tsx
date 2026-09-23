import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';

import { HomePage } from './pages/HomePage';
import { HymnsPage } from './pages/HymnsPage';
import { HymnDetailPage } from './pages/HymnDetailPage';
import { PresentationPage } from './pages/PresentationPage';
import { SearchPage } from './pages/SearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Standalone Fullscreen Presentation Route */}
              <Route path="/hymns/:id/present" element={<PresentationPage />} />

              {/* Standalone Admin Dashboard Route matching Screen 8 */}
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Standard Application Shell Routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="hymns" element={<HymnsPage />} />
                <Route path="hymns/:id" element={<HymnDetailPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:slug" element={<CategoryDetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
