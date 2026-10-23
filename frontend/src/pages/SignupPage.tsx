import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, AtSign, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { EmberParticles } from '../components/EmberParticles';

export const SignupPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the AlgoVortex Terms and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        full_name: fullName,
        email,
        username,
        password,
        confirmPassword,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#07070a] px-4 py-8 md:px-12 lg:px-20">
      <EmberParticles />

      <div className="z-10 flex w-full justify-between items-center">
        <Link to="/" className="flex items-center space-x-2.5 text-xs text-orange-400/80 hover:text-orange-300 transition-colors">
          <span>&larr; Back to AlgoVortex Home</span>
        </Link>
        <Link to="/login" className="text-xs text-gray-400 hover:text-white transition-colors">
          Already have an account? <span className="text-orange-400 font-semibold">Login</span>
        </Link>
      </div>

      <div className="relative z-10 mx-auto my-auto flex w-full max-w-lg flex-col items-center py-6">
        <div className="w-full rounded-3xl border border-orange-500/35 bg-[#0f0f15]/90 p-8 shadow-[0_0_40px_rgba(249,115,22,0.18)] backdrop-blur-xl sm:p-10">
          {/* Brand header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="h-16 w-16 mb-2">
              <img src="/assets/logo_dark.png" alt="Fox Logo" className="h-full w-full object-contain" />
            </div>
            <h1 className="font-brand text-2xl font-black tracking-widest text-white sm:text-3xl">
              JOIN THE GRINDING ERA
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Create your account & unlock competitive DSA mastery
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-white/10 bg-[#16161f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Email & Username */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@domain.com"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">Username</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <AtSign className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="cool_coder"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-gray-300">Confirm Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-orange-400/90 hover:text-orange-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-white/10 bg-[#16161f] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-[#16161f] text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-normal">
                I agree to the{' '}
                <a href="#" className="text-orange-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-400 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Create Account CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="glow-btn-fire mt-4 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wider text-white uppercase shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>

            <div className="pt-2 text-center text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
                Log in here
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="relative z-10 text-center py-2 text-xs font-mono tracking-widest text-orange-400/80">
        BUILT FOR CODERS. DRIVEN BY PASSION. &lt;/&gt;
      </div>
    </div>
  );
};
