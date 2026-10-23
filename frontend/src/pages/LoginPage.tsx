import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Code2,
  LayoutGrid,
  Trophy,
  BarChart2,
  Crown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { EmberParticles } from '../components/EmberParticles';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill demo accounts
  const fillDemoStudent = () => {
    setIdentifier('demo@algovortex.com');
    setPassword('GrindEra@2026');
  };

  const fillDemoAdmin = () => {
    setIdentifier('admin@algovortex.com');
    setPassword('AlgoAdmin@2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(identifier, password);
      const destination = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email/username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#07070a] px-4 py-8 md:px-12 lg:px-20">
      {/* Background Ember Particles */}
      <EmberParticles />

      {/* Atmospheric cracked floor gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,88,12,0.18)_0%,rgba(10,10,14,0.95)_60%,#060608_100%)] opacity-90"
        aria-hidden="true"
      />

      {/* Header spacer */}
      <div className="z-10 flex w-full justify-between items-center">
        <Link to="/" className="flex items-center space-x-2.5 text-xs text-orange-400/80 hover:text-orange-300 transition-colors">
          <span>&larr; Back to AlgoVortex Home</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400">Quick fill demo:</span>
          <button
            type="button"
            onClick={fillDemoStudent}
            className="rounded border border-orange-500/40 bg-orange-950/40 px-2 py-0.5 text-orange-300 hover:bg-orange-900/60 transition-colors"
          >
            Student
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="rounded border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-amber-300 hover:bg-amber-900/60 transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Split Grid matching Image 3 Reference */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 py-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Official Logo, GRINDING ERA, Features */}
        <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
          {/* Logo Illustration with Vines */}
          <div className="relative mb-3 flex flex-col items-center lg:items-start">
            <div className="relative h-44 w-44 md:h-52 md:w-52">
              <img
                src="/assets/logo_dark.png"
                alt="AlgoVortex Fox"
                className="h-full w-full object-contain filter drop-shadow-[0_0_25px_rgba(234,88,12,0.3)]"
              />
            </div>
          </div>

          {/* Glowing amber flare divider */}
          <div className="relative my-4 flex h-[2px] w-48 items-center justify-center bg-gradient-to-r from-transparent via-orange-500 to-transparent lg:w-64">
            <div className="absolute h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316]" />
          </div>

          {/* GRINDING ERA Metallic Badge & Slogan */}
          <div className="my-2">
            <h2 className="font-brand text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-400 to-amber-700 md:text-5xl drop-shadow-[0_4px_12px_rgba(234,88,12,0.4)]">
              GRINDING ERA
            </h2>
            <p className="mt-2 text-xs font-semibold tracking-[0.35em] text-orange-400/90 md:text-sm">
              CODE. SOLVE. CONQUER.
            </p>
          </div>

          {/* 5 Feature Shortcut Pills */}
          <div className="mt-8 grid grid-cols-5 gap-2 rounded-2xl border border-orange-500/25 bg-[#0e0e14]/70 p-2.5 shadow-xl backdrop-blur-md sm:gap-3">
            <Link
              to="/problems"
              className="flex flex-col items-center rounded-xl p-2 transition-all hover:bg-orange-500/10 group"
            >
              <Code2 className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="mt-1.5 text-[9px] font-bold tracking-wider text-gray-300 group-hover:text-white">
                DSA PROBLEMS
              </span>
            </Link>

            <Link
              to="/problems"
              className="flex flex-col items-center rounded-xl p-2 transition-all hover:bg-orange-500/10 group"
            >
              <LayoutGrid className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="mt-1.5 text-[9px] font-bold tracking-wider text-gray-300 group-hover:text-white">
                CATEGORIES
              </span>
            </Link>

            <Link
              to="/contests"
              className="flex flex-col items-center rounded-xl p-2 transition-all hover:bg-orange-500/10 group"
            >
              <Trophy className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="mt-1.5 text-[9px] font-bold tracking-wider text-gray-300 group-hover:text-white">
                CONTESTS
              </span>
            </Link>

            <Link
              to="/dashboard"
              className="flex flex-col items-center rounded-xl p-2 transition-all hover:bg-orange-500/10 group"
            >
              <BarChart2 className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="mt-1.5 text-[9px] font-bold tracking-wider text-gray-300 group-hover:text-white">
                PROGRESS
              </span>
            </Link>

            <Link
              to="/leaderboard"
              className="flex flex-col items-center rounded-xl p-2 transition-all hover:bg-orange-500/10 group"
            >
              <Crown className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="mt-1.5 text-[9px] font-bold tracking-wider text-gray-300 group-hover:text-white">
                LEADERBOARD
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Cinematic Login Card */}
        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <div className="w-full max-w-md rounded-3xl border border-orange-500/35 bg-[#0f0f15]/90 p-8 shadow-[0_0_40px_rgba(249,115,22,0.18)] backdrop-blur-xl sm:p-10">
            {/* Card Header */}
            <div className="mb-8 text-center">
              <h1 className="font-brand text-2xl font-black tracking-widest text-white sm:text-3xl">
                WELCOME BACK
              </h1>
              <p className="mt-2 text-xs text-gray-400">
                Login to continue your <span className="text-orange-400 font-semibold">DSA</span> journey
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Username */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="Enter your email or username"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 transition-colors focus:border-orange-500 focus:bg-[#1a1a26] focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">Password</label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link has been dispatched to your registered email address.');
                    }}
                    className="text-xs text-orange-400/90 hover:text-orange-300 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-3 pl-10 pr-10 text-sm text-white placeholder-gray-400 transition-colors focus:border-orange-500 focus:bg-[#1a1a26] focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Fiery Gradient LOGIN Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="glow-btn-fire flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wider text-white uppercase shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'LOGIN'
                )}
              </button>

              {/* "or" Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute bg-[#0f0f15] px-3 text-[11px] uppercase tracking-wider text-gray-400">
                  or
                </span>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert('Google OAuth provider is ready to be connected with your GOOGLE_CLIENT_ID.')}
                  className="flex w-full items-center justify-center space-x-3 rounded-xl border border-white/10 bg-[#14141e] py-2.5 text-xs font-medium text-gray-200 transition-colors hover:border-orange-500/40 hover:bg-[#1b1b28]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('GitHub OAuth provider is ready to be connected with your GITHUB_CLIENT_ID.')}
                  className="flex w-full items-center justify-center space-x-3 rounded-xl border border-white/10 bg-[#14141e] py-2.5 text-xs font-medium text-gray-200 transition-colors hover:border-orange-500/40 hover:bg-[#1b1b28]"
                >
                  <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Sign up link */}
              <div className="pt-2 text-center text-xs text-gray-400">
                New here?{' '}
                <Link to="/signup" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Banner matching Image 3 */}
      <div className="relative z-10 text-center py-2 text-xs font-mono tracking-widest text-orange-400/80">
        BUILT FOR CODERS. DRIVEN BY PASSION. &lt;/&gt;
      </div>
    </div>
  );
};
