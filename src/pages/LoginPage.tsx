import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/ui';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Please enter your email address.';
    if (!password.trim()) nextErrors.password = 'Please enter your password.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    login(email.trim(), isSignUp ? name.trim() : undefined, 'user');
    setSubmitted(true);
    setTimeout(() => navigate('/'), 500);
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
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors focus-ring rounded-md"
      >
        <ArrowLeft size={15} />
        <span>Return Home</span>
      </Link>

      <div className="bg-surface border border-border rounded-[16px] shadow-xs p-6 sm:p-8">
        {/* Brand — official logo with clear space */}
        <div className="text-center mb-7">
          <img
            src="/rehoboth-logo.jpg"
            alt="Rehoboth Assembly logo"
            className="w-16 h-16 rounded-xl object-cover shadow-xs mx-auto mb-3"
            width={64}
            height={64}
            loading="eager"
          />
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isSignUp
              ? 'Join to save favourites across all your devices.'
              : 'Sign in to access your favourites and history.'}
          </p>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <span className="inline-flex w-12 h-12 rounded-xl bg-success-soft text-success items-center justify-center mx-auto">
              <Check size={24} />
            </span>
            <p className="text-sm font-semibold text-foreground">
              Welcome, {user?.name}! Taking you home…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Mary Asuquo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              error={errors.password}
            />

            {/* Primary CTA — gold with navy text, per Rehoboth button system */}
            <button
              type="submit"
              className="w-full h-11 rounded-[10px] bg-gold text-on-gold hover:bg-gold-strong text-sm font-semibold transition-colors focus-ring"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp((prev) => !prev)}
                className="font-semibold text-primary hover:underline focus-ring rounded-sm"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>

            <div className="relative py-1">
              <div className="border-t border-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-surface text-[11px] uppercase tracking-wider text-subtle-foreground">
                or
              </span>
            </div>

            <Button variant="secondary" className="w-full" onClick={() => handleQuickLogin('user')}>
              Continue without an account
            </Button>

            {/* Demo sign-ins — development affordance */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-subtle-foreground">
              <span>Demo quick sign-in:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className="px-2 py-1 rounded-md border border-border bg-surface-secondary hover:bg-border text-foreground font-medium transition-colors focus-ring"
                >
                  Worshipper
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="px-2 py-1 rounded-md bg-primary-soft text-primary border border-primary-soft-border hover:bg-primary hover:text-primary-foreground font-medium transition-colors focus-ring"
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
