import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { api } from '../services/api';
import { User } from '../types';
import { Shield, Plus, Trash2, Users, Code2, CheckCircle2, Clock, Terminal, AlertCircle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'create-problem'>('stats');

  // New problem form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [topicSlug, setTopicSlug] = useState('arrays-hashing');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleExpected, setSampleExpected] = useState('');
  const [hiddenInput, setHiddenInput] = useState('');
  const [hiddenExpected, setHiddenExpected] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getAdminStats();
        setStats(res.stats);
        setRecentUsers(res.recentUsers);
      } catch (err: any) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const testCases = [];
    if (sampleInput && sampleExpected) {
      testCases.push({ input: sampleInput, expected_output: sampleExpected, is_sample: true });
    }
    if (hiddenInput && hiddenExpected) {
      testCases.push({ input: hiddenInput, expected_output: hiddenExpected, is_sample: false });
    }

    try {
      await api.createProblem({
        title,
        slug,
        difficulty,
        topic_slug: topicSlug,
        description,
        input_format: inputFormat,
        output_format: outputFormat,
        constraints,
        testCases,
        starterCode: {
          python: '# Write solution here\n',
          javascript: '// Write solution here\n',
        },
      });

      setFeedback('Problem created successfully!');
      setTitle('');
      setSlug('');
      setDescription('');
      setInputFormat('');
      setOutputFormat('');
      setConstraints('');
      setSampleInput('');
      setSampleExpected('');
      setHiddenInput('');
      setHiddenExpected('');
    } catch (err: any) {
      setFeedback(err.message || 'Failed to create problem.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-brand text-2xl font-bold text-white">Administrator Control Center</h1>
            <p className="text-xs text-gray-400">Manage problems, platform telemetry, and system test cases</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 flex space-x-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('stats')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            System Telemetry & Users
          </button>
          <button
            onClick={() => setActiveTab('create-problem')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'create-problem'
                ? 'bg-amber-500 text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            + Create New Problem
          </button>
        </div>

        {activeTab === 'stats' ? (
          <div className="mt-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#0e0e15] p-5 shadow-lg">
                <span className="text-xs text-gray-400">Total Users</span>
                <div className="mt-2 font-brand text-3xl font-black text-white">
                  {stats?.totalUsers || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e0e15] p-5 shadow-lg">
                <span className="text-xs text-gray-400">Published Problems</span>
                <div className="mt-2 font-brand text-3xl font-black text-white">
                  {stats?.totalProblems || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e0e15] p-5 shadow-lg">
                <span className="text-xs text-gray-400">Submissions Processed</span>
                <div className="mt-2 font-brand text-3xl font-black text-orange-400">
                  {stats?.totalSubmissions || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e0e15] p-5 shadow-lg">
                <span className="text-xs text-gray-400">Server Uptime</span>
                <div className="mt-2 font-mono text-xl font-bold text-emerald-400">
                  {stats?.uptimeSeconds || 0}s
                </div>
              </div>
            </div>

            {/* Recent Registered Users */}
            <div className="rounded-3xl border border-white/10 bg-[#0e0e14] p-6 shadow-xl">
              <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-400" />
                <span>Recent Platform Accounts</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="p-3">User ID</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="p-3 font-mono text-gray-400">#{u.id}</td>
                        <td className="p-3 font-semibold text-white">{u.username}</td>
                        <td className="p-3 text-gray-300">{u.email}</td>
                        <td className="p-3 text-gray-400">{u.full_name}</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-gray-800 text-gray-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400 font-mono">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Create Problem Form */
          <div className="mt-8 rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-8 shadow-2xl">
            {feedback && (
              <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-300">
                {feedback}
              </div>
            )}

            <form onSubmit={handleCreateProblem} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    required
                    placeholder="e.g. Invert Binary Tree"
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="invert-binary-tree"
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Topic Category</label>
                <select
                  value={topicSlug}
                  onChange={(e) => setTopicSlug(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-2 text-xs text-white"
                >
                  <option value="arrays-hashing">Arrays & Hashing</option>
                  <option value="two-pointers">Two Pointers</option>
                  <option value="sliding-window">Sliding Window</option>
                  <option value="stack">Stack & Queues</option>
                  <option value="binary-search">Binary Search</option>
                  <option value="linked-list">Linked List</option>
                  <option value="trees">Trees & BST</option>
                  <option value="heaps">Heaps & Priority Queues</option>
                  <option value="graphs">Graphs & BFS/DFS</option>
                  <option value="dynamic-programming">Dynamic Programming</option>
                  <option value="bit-manipulation">Bit Manipulation</option>
                  <option value="intervals">Intervals</option>
                  <option value="backtracking">Backtracking</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Problem Statement</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Clear Markdown description with mathematical definitions and examples..."
                  className="w-full rounded-xl border border-white/10 bg-[#14141e] p-3 text-xs text-white"
                />
              </div>

              {/* Test Cases configuration */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-white/5 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-orange-400 mb-2">Sample Test Case (Public)</h4>
                  <textarea
                    rows={2}
                    value={sampleInput}
                    onChange={(e) => setSampleInput(e.target.value)}
                    placeholder="Sample input stdin..."
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] p-2 text-xs text-white mb-2"
                  />
                  <textarea
                    rows={2}
                    value={sampleExpected}
                    onChange={(e) => setSampleExpected(e.target.value)}
                    placeholder="Sample expected output stdout..."
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-2">Hidden Test Case (Protected)</h4>
                  <textarea
                    rows={2}
                    value={hiddenInput}
                    onChange={(e) => setHiddenInput(e.target.value)}
                    placeholder="Hidden edge-case input stdin..."
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] p-2 text-xs text-white mb-2"
                  />
                  <textarea
                    rows={2}
                    value={hiddenExpected}
                    onChange={(e) => setHiddenExpected(e.target.value)}
                    placeholder="Hidden expected output stdout..."
                    className="w-full rounded-xl border border-white/10 bg-[#14141e] p-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="glow-btn-fire rounded-xl px-8 py-3 text-xs font-bold text-white shadow-xl disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Problem to Arena'}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
