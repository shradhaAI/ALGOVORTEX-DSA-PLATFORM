import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { api } from '../services/api';
import { Problem, Topic } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Lock,
} from 'lucide-react';

export const ProblemListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProblems, setTotalProblems] = useState<number>(0);

  // Filters from query params
  const search = searchParams.get('search') || '';
  const selectedTopic = searchParams.get('topic') || 'all';
  const selectedDifficulty = searchParams.get('difficulty') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await api.getTopics();
        setTopics(res.topics);
      } catch {
        // Fallback
      }
    }
    loadTopics();
  }, []);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      try {
        const res = await api.getProblems({
          search,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          page: currentPage,
          limit: 15,
        });
        setProblems(res.problems);
        setTotalPages(res.pagination.totalPages);
        setTotalProblems(res.pagination.total);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, [search, selectedTopic, selectedDifficulty, selectedStatus, currentPage, user]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
  };

  const handleToggleBookmark = async (problemId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to bookmark problems.');
      return;
    }
    try {
      const res = await api.toggleBookmark(problemId);
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problemId
            ? { ...p, isBookmarked: res.isBookmarked, is_bookmarked: res.isBookmarked ? 1 : 0 }
            : p
        )
      );
    } catch {
      // Ignored
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-brand text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                PRACTICE ARENA
              </span>
              <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[10px] font-mono text-orange-300">
                {totalProblems} Questions
              </span>
            </div>
            <h1 className="mt-1 font-brand text-3xl font-black text-white sm:text-4xl">
              Algorithmic Problem Library
            </h1>
          </div>
          <Link
            to="/roadmap"
            className="inline-flex items-center space-x-2 rounded-xl border border-orange-500/30 bg-[#121118] px-4 py-2.5 text-xs font-semibold text-orange-300 hover:border-orange-500 hover:bg-[#1a1a24] transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Structured SDE Roadmap</span>
          </Link>
        </div>

        {/* Category Cards / Boxes */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 font-brand">
              Core Categories
            </span>
            <span className="text-[11px] text-gray-400">
              Select any category to view its questions
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
            <button
              onClick={() => updateParam('topic', 'all')}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all border ${
                selectedTopic === 'all'
                  ? 'border-orange-500 bg-orange-500/15 text-white shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                  : 'border-white/5 bg-[#101018] text-gray-300 hover:border-orange-500/50 hover:bg-[#161622]'
              }`}
            >
              <span className="text-xs font-bold">All</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{totalProblems}</span>
            </button>
            {topics.map((t) => {
              const isSelected = selectedTopic === t.slug;
              return (
                <button
                  key={t.id}
                  onClick={() => updateParam('topic', t.slug)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all border ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/15 text-white shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                      : 'border-white/5 bg-[#101018] text-gray-300 hover:border-orange-500/50 hover:bg-[#161622]'
                  }`}
                >
                  <span className="text-xs font-bold truncate w-full">{t.name}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{t.problem_count || 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-orange-500/20 bg-[#0e0e15]/80 p-4 backdrop-blur-xl md:grid-cols-12">
          {/* Search Input */}
          <div className="relative md:col-span-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              placeholder="Search problems by title, keywords..."
              className="w-full rounded-xl border border-white/10 bg-[#14141e] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Topic Select */}
          <div className="md:col-span-3">
            <select
              value={selectedTopic}
              onChange={(e) => updateParam('topic', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#14141e] py-2.5 px-3 text-xs text-gray-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">All Topics (16 Categories)</option>
              {topics.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name} ({t.problem_count || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => updateParam('difficulty', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#14141e] py-2.5 px-3 text-xs text-gray-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Select (Solved/Unsolved) */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => updateParam('status', e.target.value)}
              disabled={!user}
              className={`w-full rounded-xl border border-white/10 bg-[#14141e] py-2.5 px-3 text-xs text-gray-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                !user ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="all">Status: All Problems</option>
              <option value="solved">Status: Solved Only</option>
              <option value="unsolved">Status: Unsolved Only</option>
            </select>
          </div>
        </div>

        {/* Problems Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-orange-500/20 bg-[#0d0d14] shadow-2xl">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            </div>
          ) : problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
              <Search className="h-10 w-10 text-orange-400/50 mb-3" />
              <p className="text-sm font-medium text-gray-300">No matching problems found</p>
              <p className="mt-1 text-xs text-gray-400">Try adjusting your filters or search keywords</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#11111a] text-gray-400">
                    <th className="w-12 p-4 text-center">Status</th>
                    <th className="p-4 font-bold text-gray-200">Title</th>
                    <th className="p-4 font-bold text-gray-200">Topic</th>
                    <th className="p-4 font-bold text-gray-200">Difficulty</th>
                    <th className="p-4 font-bold text-gray-200">Acceptance</th>
                    <th className="w-12 p-4 text-center">Bookmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {problems.map((p) => {
                    const isSolved = p.isSolved || p.is_solved === 1;
                    const isBookmarked = p.isBookmarked || p.is_bookmarked === 1;

                    return (
                      <tr
                        key={p.id}
                        className="group transition-colors hover:bg-orange-500/5 cursor-pointer"
                      >
                        <td className="p-4 text-center">
                          {isSolved ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" />
                          ) : (
                            <div className="mx-auto h-3 w-3 rounded-full border border-gray-600 group-hover:border-orange-500" />
                          )}
                        </td>

                        <td className="p-4 font-medium">
                          <Link
                            to={`/problems/${p.slug}`}
                            className="text-white hover:text-orange-400 transition-colors"
                          >
                            <span className="font-mono text-gray-400 mr-2">{p.id}.</span>
                            <span className="font-semibold">{p.title}</span>
                          </Link>
                        </td>

                        <td className="p-4">
                          <span className="rounded-lg border border-white/5 bg-[#161622] px-2.5 py-1 text-[11px] font-medium text-gray-300">
                            {p.topic_name || p.topic_slug}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              p.difficulty === 'Easy'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                                : p.difficulty === 'Medium'
                                ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                                : 'bg-red-950/60 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {p.difficulty}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-gray-400">
                          {p.acceptance_rate ? `${p.acceptance_rate}%` : '72.0%'}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(p.id, e)}
                            className="text-gray-400 hover:text-orange-400 transition-colors"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="h-4 w-4 text-orange-400" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 bg-[#11111a] px-4 py-3 text-xs text-gray-400 sm:px-6">
              <div>
                Page <span className="font-bold text-white">{currentPage}</span> of{' '}
                <span className="font-bold text-white">{totalPages}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center space-x-1 rounded-lg border border-white/10 bg-[#161622] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#1f1f2e] disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center space-x-1 rounded-lg border border-white/10 bg-[#161622] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#1f1f2e] disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
