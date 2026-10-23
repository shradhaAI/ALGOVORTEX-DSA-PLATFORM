import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Problem } from '../types';
import { User, Bookmark } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState<string>(user?.full_name || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [github, setGithub] = useState<string>(user?.github_username || '');
  const [bookmarks, setBookmarks] = useState<Problem[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const res = await api.getUserBookmarks();
        setBookmarks(res.bookmarks);
      } catch (err) {
        console.error('Failed to load user bookmarks:', err);
      }
    }
    loadBookmarks();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await api.updateProfile({
        full_name: fullName,
        bio,
        github_username: github,
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-500/25 bg-[#0e0e14] p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4 border-b border-white/10 pb-8 text-center sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-600 font-brand text-2xl font-black text-white shadow-[0_0_25px_rgba(249,115,22,0.4)]">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-brand text-2xl font-bold text-white">{user?.full_name}</h1>
                <span className="rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-mono text-orange-400">
                  @{user?.username}
                </span>
                {user?.role === 'admin' && (
                  <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">{user?.bio || 'Competitive coder in Grinding Era.'}</p>
              <div className="mt-2 flex items-center space-x-4 text-xs font-mono text-gray-400">
                <span>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}</span>
                <span>{user?.solvedProblemsCount || 0} Problems Solved</span>
              </div>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
              {message}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="mt-8 space-y-5">
            <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
              Account Settings & Bio
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#14141e] px-4 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">GitHub Profile Handle</label>
                <div className="relative">
                  <svg className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 fill-current text-gray-400" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="github_username"
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] py-2 pl-9 pr-4 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Personal Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Share your coding goals, target companies, or favorite algorithmic topics..."
                className="w-full rounded-xl border border-white/10 bg-[#14141e] p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="glow-btn-fire rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Bookmarked Questions */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Bookmark className="h-4 w-4 text-orange-400" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </h3>

            {bookmarks.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">
                You haven't bookmarked any problems yet. Click the bookmark icon on any problem to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#14141e] p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{bm.title}</div>
                      <div className="text-[10px] text-gray-400">{bm.topic_name}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        bm.difficulty === 'Easy'
                          ? 'text-emerald-400'
                          : bm.difficulty === 'Medium'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {bm.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
