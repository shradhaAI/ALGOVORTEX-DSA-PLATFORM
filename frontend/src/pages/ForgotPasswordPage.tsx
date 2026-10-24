import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const PAGE_BG =
  'min-h-screen w-full flex flex-col items-center justify-center ' +
  'bg-[#0f0b07] ' +
  'bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] ' +
  '[background-size:28px_28px] ' +
  'px-4 py-10 relative overflow-hidden';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    try {
      await api.requestPasswordReset(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err: any) {
      // Always show the same message to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={PAGE_BG}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(180,70,10,0.22)_0%,transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-orange-700/50 bg-[#1a100a]/95 shadow-[0_0_60px_rgba(180,70,10,0.30)] backdrop-blur-xl"
        style={{ padding: '36px 32px' }}
      >
        {/* Back link */}
        <Link
          to="/login"
          className="mb-6 inline-flex items-center space-x-1.5 text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </Link>

        <h1 className="mb-2 text-xl font-bold text-white">Reset your password</h1>
        <p className="mb-6 text-sm text-gray-400">
          Enter your registered email address and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center space-y-4 text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="font-semibold text-white">Check your inbox</p>
            <p className="text-sm text-gray-400">
              If an account exists for <span className="text-orange-300">{email}</span>, a password reset link has been sent.
              Check your spam folder if you don't see it within a few minutes.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              (Email delivery requires SMTP configuration in the backend .env file.)
            </p>
            <Link
              to="/login"
              className="mt-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-2.5 text-sm font-bold text-white shadow hover:from-orange-400 hover:to-amber-300"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="mb-4 flex items-start space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-200">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-[#3a2a1a] bg-[#1c1410] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500/60"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-orange-400 hover:to-amber-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending…</span>
                </span>
              ) : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
