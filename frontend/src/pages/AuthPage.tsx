import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, Shield, UserRound } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  email: string;
}

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          setAccount(await response.json());
        } else if (response.status !== 401) {
          setError('Could not check your sign-in status. Please try again.');
        }
      } catch {
        setError('Could not connect to HireShield. Please try again.');
      } finally {
        setBusy(false);
      }
    };

    void loadAccount();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? { name, email, password } : { email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data.detail === 'string' ? data.detail : 'Please check your details and try again.';
        throw new Error(detail);
      }

      if (mode === 'register') {
        setMode('login');
        setPassword('');
        setMessage('Your account is ready. Sign in with your email and password.');
      } else {
        setAccount(data);
        setPassword('');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Could not sign out. Please try again.');
      setAccount(null);
      setMessage('You have been signed out.');
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Could not sign out.');
    }
  };

  return (
    <div className="flex-1 bg-[#F6F8FB] px-4 py-10 sm:px-6 sm:py-16">
      <section className="mx-auto grid max-w-[900px] overflow-hidden rounded-3xl border border-[#E6ECF3] bg-white shadow-[0_20px_60px_rgba(11,31,58,0.08)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B1F3A] p-9 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative">
            <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A896]">
              <Shield className="h-6 w-6" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#63D7C7]">Your job search, safer</p>
            <h1 className="text-3xl font-bold leading-tight text-white">Make every opportunity a little more secure.</h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Sign in to keep your HireShield account close while you check suspicious job offers.
            </p>
          </div>
          <div className="relative flex items-center gap-2 text-xs text-white/60">
            <LockKeyhole className="h-4 w-4 text-[#63D7C7]" />
            Your password is stored as a secure hash.
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#00A896] md:hidden">
            <Shield className="h-5 w-5" /> HireShield account
          </div>

          {account ? (
            <div className="py-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#00A896]/10 text-[#00A896]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00A896]">Signed in</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">Welcome, {account.name}</h2>
              <p className="mt-2 text-sm text-[#5B6678]">{account.email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-8 rounded-xl border border-[#E6ECF3] px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F6F8FB]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00A896]">Welcome to HireShield</p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-[#5B6678]">
                {mode === 'login' ? 'Good to have you back.' : 'A few details and you’re ready to go.'}
              </p>

              <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#F6F8FB] p-1" aria-label="Account action">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-[#8A94A6]'}`}
                  aria-pressed={mode === 'login'}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setMessage(''); }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-[#0B1F3A] shadow-sm' : 'text-[#8A94A6]'}`}
                  aria-pressed={mode === 'register'}
                >
                  Create account
                </button>
              </div>

              {message && (
                <p role="status" className="mt-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-3 text-sm text-[#18804A]">
                  {message}
                </p>
              )}
              {error && (
                <p role="alert" className="mt-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-3 text-sm text-[#B4232D]">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {mode === 'register' && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#0B1F3A]">Full name</span>
                    <span className="relative block">
                      <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A94A6]" />
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#E6ECF3] bg-white py-3 pl-10 pr-3.5 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#AAB2BF] focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/10"
                      />
                    </span>
                  </label>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-[#0B1F3A]">Email address</span>
                  <span className="relative block">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A94A6]" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#E6ECF3] bg-white py-3 pl-10 pr-3.5 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#AAB2BF] focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/10"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-[#0B1F3A]">Password</span>
                  <span className="relative block">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A94A6]" />
                    <input
                      type="password"
                      name="password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      minLength={mode === 'register' ? 8 : 1}
                      maxLength={128}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
                      className="w-full rounded-xl border border-[#E6ECF3] bg-white py-3 pl-10 pr-3.5 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#AAB2BF] focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/10"
                    />
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={submitting || busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A896] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#007F73] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
              <p className="mt-5 text-center text-[11px] leading-5 text-[#8A94A6]">
                Never reuse a password you use for another important account.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
