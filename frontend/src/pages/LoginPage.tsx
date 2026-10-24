import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Google "G" SVG logo (no dependency on external image)
───────────────────────────────────────────────────────────────────────────── */
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Shared card-level background style (dark brown-black + subtle dot grid)
───────────────────────────────────────────────────────────────────────────── */
const PAGE_BG =
  'min-h-screen w-full flex flex-col items-center justify-center ' +
  'bg-[#0f0b07] ' +
  // subtle dot-grid overlay via CSS bg-image
  'bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] ' +
  '[background-size:28px_28px] ' +
  'px-4 py-10 relative overflow-hidden';

const WARM_GLOW =
  'pointer-events-none absolute inset-0 ' +
  'bg-[radial-gradient(ellipse_at_50%_80%,rgba(180,70,10,0.22)_0%,transparent_65%)]';

/* ─────────────────────────────────────────────────────────────────────────────
   Combined Login + Signup card (tab-switched)
   Exported individually so routing works, but they share this component.
───────────────────────────────────────────────────────────────────────────── */
type Tab = 'login' | 'signup';

interface AuthCardProps {
  defaultTab: Tab;
}

const AuthCard: React.FC<AuthCardProps> = ({ defaultTab }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(defaultTab);

  /* ── Login state ── */
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  /* ── Signup state ── */
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interest, setInterest] = useState('Data Structures & Algorithms');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginId.trim() || !loginPass) {
      setLoginError('Please enter your email/username and password.');
      return;
    }
    setLoginLoading(true);
    try {
      await login(loginId.trim(), loginPass);
      const dest = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(dest, { replace: true });
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setSignupError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setSignupError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setSignupError('Please accept the AlgoVortex terms of service and privacy policy.');
      return;
    }
    setSignupLoading(true);
    try {
      await register({ full_name: fullName, username, email, password, confirmPassword });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setSignupError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogleClick = () => {
    // Google OAuth requires GOOGLE_CLIENT_ID configured on backend
    alert(
      'Google Sign-In requires a GOOGLE_CLIENT_ID in your backend .env file.\n' +
      'Configure OAuth credentials at: https://console.cloud.google.com/'
    );
  };

  /* ── Shared input class ── */
  const inputCls =
    'w-full rounded-xl border border-[#3a2a1a] bg-[#1c1410] py-3 pl-10 pr-4 ' +
    'text-sm text-white placeholder-gray-500 outline-none ' +
    'transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500/60';

  const inputClsNoIcon =
    'w-full rounded-xl border border-[#3a2a1a] bg-[#1c1410] py-3 px-4 ' +
    'text-sm text-white placeholder-gray-500 outline-none ' +
    'transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500/60';

  const iconCls = 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500';

  return (
    <div className={PAGE_BG}>
      {/* Warm background glow */}
      <div className={WARM_GLOW} aria-hidden="true" />

      {/* Auth Card */}
      <div
        className={`
          relative z-10 w-full rounded-2xl border border-orange-700/50
          bg-[#1a100a]/95 shadow-[0_0_60px_rgba(180,70,10,0.30)]
          backdrop-blur-xl
          ${tab === 'login' ? 'max-w-md' : 'max-w-lg'}
          transition-all duration-300
        `}
        style={{ padding: '28px 32px 32px' }}
      >
        {/* ── Tab Switcher ── */}
        <div className="mb-7 flex rounded-full bg-[#261810] p-1 border border-[#3a2a1a]">
          <button
            type="button"
            onClick={() => { setTab('login'); setLoginError(null); }}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-200 ${
              tab === 'login'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setSignupError(null); }}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-200 ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* ══════════════ LOGIN FORM ══════════════ */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} noValidate>
            {/* Error */}
            {loginError && (
              <div className="mb-5 flex items-start space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Email / Username */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-200">Email or Username</label>
              <div className="relative">
                <div className={iconCls}><Mail className="h-4 w-4" /></div>
                <input
                  type="text"
                  autoComplete="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder=""
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="mb-2 block text-sm font-medium text-gray-200">Password</label>
              <div className="relative">
                <div className={iconCls}><Lock className="h-4 w-4" /></div>
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder=""
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                  aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                >
                  {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="mb-5 text-left">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="mb-4 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-orange-400 hover:to-amber-300 disabled:opacity-60"
            >
              {loginLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Logging in…</span>
                </span>
              ) : 'Login'}
            </button>

            {/* OR divider */}
            <div className="relative mb-4 flex items-center">
              <div className="flex-1 border-t border-[#3a2a1a]" />
              <span className="mx-3 text-xs uppercase tracking-widest text-gray-500">OR</span>
              <div className="flex-1 border-t border-[#3a2a1a]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="mb-5 flex w-full items-center justify-center space-x-3 rounded-full border border-[#3a2a1a] bg-[#261810] py-3 text-sm font-medium text-white transition-colors hover:border-orange-600/50 hover:bg-[#2d1e12]"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>

            {/* Footer links */}
            <p className="text-center text-sm text-gray-400">
              New to the vortex?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="font-semibold text-orange-400 hover:text-orange-300 hover:underline"
              >
                Create an account
              </button>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-300 hover:underline transition-colors">
                Back to home
              </Link>
            </p>
          </form>
        )}

        {/* ══════════════ SIGNUP FORM ══════════════ */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} noValidate>
            {/* Error */}
            {signupError && (
              <div className="mb-5 flex items-start space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Row 1: Full Name + Username */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">Full Name</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=""
                  className={inputClsNoIcon}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">Username</label>
                <div className="relative">
                  <div className={iconCls}>
                    {/* Person icon inline SVG */}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email (full width) */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-200">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className={inputClsNoIcon}
              />
            </div>

            {/* Row 3: Password + Confirm Password */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className={`${inputClsNoIcon} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">Confirm Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=""
                  className={inputClsNoIcon}
                />
              </div>
            </div>

            {/* Interest dropdown */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-200">Interest</label>
              <div className="relative">
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className={`${inputClsNoIcon} pr-8 appearance-none cursor-pointer`}
                >
                  <option>Data Structures & Algorithms</option>
                  <option>Competitive Programming</option>
                  <option>System Design</option>
                  <option>Interview Prep (FAANG)</option>
                  <option>Web Development</option>
                  <option>Machine Learning</option>
                  <option>General Computer Science</option>
                </select>
                {/* Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="mb-5 flex items-start space-x-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={termsAccepted}
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  termsAccepted
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-orange-500/60 bg-transparent'
                }`}
              >
                {termsAccepted && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label className="text-sm text-gray-400 leading-snug">
                I agree to the <span className="font-semibold text-white">ALGOVORTEX</span>{' '}
                <a href="#" className="text-orange-400 hover:underline">terms of service</a> and{' '}
                <a href="#" className="text-orange-400 hover:underline">privacy policy</a>.
              </label>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={signupLoading}
              className="mb-4 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-orange-400 hover:to-amber-300 disabled:opacity-60"
            >
              {signupLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating account…</span>
                </span>
              ) : 'Create Account'}
            </button>

            {/* OR divider */}
            <div className="relative mb-4 flex items-center">
              <div className="flex-1 border-t border-[#3a2a1a]" />
              <span className="mx-3 text-xs uppercase tracking-widest text-gray-500">OR</span>
              <div className="flex-1 border-t border-[#3a2a1a]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="mb-5 flex w-full items-center justify-center space-x-3 rounded-full border border-[#3a2a1a] bg-[#261810] py-3 text-sm font-medium text-white transition-colors hover:border-orange-600/50 hover:bg-[#2d1e12]"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>

            {/* Footer links */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="font-semibold text-orange-400 hover:text-orange-300 hover:underline"
              >
                Login
              </button>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-300 hover:underline transition-colors">
                Back to home
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

/* ─── Exported page components (referenced by React Router) ─── */
export const LoginPage: React.FC = () => <AuthCard defaultTab="login" />;
export const SignupPage: React.FC = () => <AuthCard defaultTab="signup" />;
