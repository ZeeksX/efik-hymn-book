import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply the persisted theme before first paint to avoid a light/dark flash.
// Must stay in sync with ThemeContext + storageService.getTheme().
try {
  const stored = localStorage.getItem('efik_hymns_theme')
  const theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  // meta theme-color is updated by ThemeContext; static default lives in index.html
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
} catch {
  document.documentElement.setAttribute('data-theme', 'light')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
