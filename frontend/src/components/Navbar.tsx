import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  Terminal,
  Trophy,
  BarChart3,
  Map,
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Flame,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-[#08080c]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand & Original Fox Logo */}
        <Link to="/" className="group flex items-center space-x-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-orange-500/30 bg-[#121118] p-1 shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all group-hover:border-orange-500/70 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            <img
              src="/assets/logo_dark.png"
              alt="AlgoVortex Fox"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-brand text-lg font-extrabold tracking-wider text-orange-50 transition-colors group-hover:text-orange-400">
              ALGOVORTEX
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400/90">
              GAME CHANGER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center space-x-1 md:flex">
          {/* Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              onBlur={() => setTimeout(() => setProductsDropdownOpen(false), 200)}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/visualizer') || location.pathname.startsWith('/problems')
                  ? 'text-orange-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>Products</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {productsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-orange-500/30 bg-[#121118] p-2 shadow-2xl backdrop-blur-xl">
                <Link
                  to="/problems"
                  className="flex items-center space-x-3 rounded-lg p-2 text-sm text-gray-200 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <Code2 className="h-4 w-4 text-orange-400" />
                  <div>
                    <div className="font-medium">Problem Explorer</div>
                    <div className="text-xs text-gray-400">Practice curated DSA problems</div>
                  </div>
                </Link>
                <Link
                  to="/visualizer"
                  className="flex items-center space-x-3 rounded-lg p-2 text-sm text-gray-200 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="font-medium">Algorithm Visualizer</div>
                    <div className="text-xs text-gray-400">Step-by-step interactive animations</div>
                  </div>
                </Link>
                <Link
                  to="/roadmap"
                  className="flex items-center space-x-3 rounded-lg p-2 text-sm text-gray-200 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <Map className="h-4 w-4 text-orange-400" />
                  <div>
                    <div className="font-medium">Learning Roadmaps</div>
                    <div className="text-xs text-gray-400">From 0 to FAANG SDE-1</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/problems"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/problems')
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Problems
          </Link>

          <Link
            to="/visualizer"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/visualizer')
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Visualizer
          </Link>

          <Link
            to="/roadmap"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/roadmap')
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Learn
          </Link>

          <Link
            to="/contests"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/contests')
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Contests
          </Link>

          <Link
            to="/leaderboard"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive('/leaderboard')
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Leaderboard
          </Link>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden items-center space-x-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                className="flex items-center space-x-3 rounded-full border border-orange-500/30 bg-[#14141c] py-1.5 pl-2 pr-3 text-sm text-gray-200 transition-all hover:border-orange-500 hover:bg-[#1a1a24]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 font-bold text-white shadow-inner">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate font-medium text-gray-200">
                  {user.username}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-orange-500/30 bg-[#121118] p-2 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-white/10 px-3 py-2 text-xs text-gray-400">
                    Signed in as <span className="font-semibold text-orange-400">{user.email}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-orange-500/10 hover:text-orange-400"
                  >
                    <BarChart3 className="h-4 w-4 text-orange-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-orange-500/10 hover:text-orange-400"
                  >
                    <User className="h-4 w-4 text-orange-400" />
                    <span>My Profile</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10"
                    >
                      <Shield className="h-4 w-4 text-amber-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="glow-btn-fire rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-orange-500/20 bg-[#0d0d12] px-4 pt-2 pb-6 md:hidden">
          <div className="flex flex-col space-y-2">
            <Link
              to="/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Problems
            </Link>
            <Link
              to="/visualizer"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Algorithm Visualizer
            </Link>
            <Link
              to="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Roadmaps
            </Link>
            <Link
              to="/contests"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Contests
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Leaderboard
            </Link>

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-orange-400 hover:bg-white/5"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-300 hover:bg-white/5"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-left text-red-400 hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-center font-medium text-gray-300 hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="glow-btn-fire rounded-lg py-2 text-center font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
