import React, { useState } from 'react';
import { BookOpen, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, isSignUp ? name : undefined, 'user');
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleQuickLogin = (demoRole: 'user' | 'admin') => {
    if (demoRole === 'admin') {
      login('admin@efikhymns.org', 'Church Admin', 'admin');
    } else {
      login('john.doe@example.com', 'John Doe', 'user');
    }
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Return Home</span>
      </Link>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-xl p-6 sm:p-8 transition-colors">
        {/* Brand Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--brand-primary)] text-white shadow-xs">
              <BookOpen size={18} />
            </div>
            <span className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Efik Hymn Book
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
            {isSignUp
              ? 'Join to save favourites and sync your hymnal reading.'
              : 'Sign in to access your favourites across all devices.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)] flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Welcome back, {user?.name}! Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Asuquo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link simulated to your email.')}
                    className="text-xs text-[var(--brand-primary)] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--brand-primary)] text-white font-semibold text-sm hover:bg-[var(--brand-primary-hover)] transition-colors cursor-pointer shadow-xs"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            {/* Toggle */}
            <div className="text-center text-xs text-[var(--text-secondary)] pt-1">
              <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
              <button
                type="button"
                onClick={() => setIsSignUp((prev) => !prev)}
                className="font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-subtle)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
                  or
                </span>
              </div>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Profiles */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
              <span>Demo Quick Sign-In:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className="px-2 py-1 rounded-md bg-[var(--bg-main)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium cursor-pointer"
                >
                  John Doe
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="px-2 py-1 rounded-md bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white border border-[var(--brand-primary)]/30 font-medium cursor-pointer"
                >
                  Church Admin
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
