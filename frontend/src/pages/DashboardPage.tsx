import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardData } from '../types';
import {
  Flame,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  Bookmark,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Code2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white">
        <Navbar />
        <div className="flex h-[70vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProblems: 0,
    totalSolved: 0,
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 },
  };

  const solvedPct = stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0;

  // Build a 12-week activity heatmap grid
  const activityMap = new Map((data?.activityHeatmap || []).map((a) => [a.date, a.count]));
  const heatmapDays: Array<{ date: string; count: number }> = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dStr = d.toISOString().split('T')[0];
    heatmapDays.push({
      date: dStr,
      count: activityMap.get(dStr) || 0,
    });
  }

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-orange-500/25 bg-gradient-to-r from-[#14141e]/90 via-[#101018]/90 to-[#0c0c12]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-brand text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                  DEVELOPER ARENA
                </span>
                <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[10px] font-mono text-orange-300">
                  Role: {user?.role}
                </span>
              </div>
              <h1 className="mt-1 font-brand text-2xl font-black text-white sm:text-3xl">
                Welcome back, {user?.full_name || user?.username}!
              </h1>
              <p className="mt-1 text-xs text-gray-400">
                You are currently in your <span className="text-orange-400 font-semibold">Grinding Era</span>. Keep your streak alive and sharpen your problem-solving reflexes.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-2xl border border-orange-500/30 bg-[#161622] px-4 py-2.5 shadow-lg">
                <Flame className="h-6 w-6 text-orange-500 animate-bounce" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Streak</div>
                  <div className="font-brand text-lg font-black text-white">
                    {data?.currentStreak || 0} <span className="text-xs font-normal text-orange-400">Days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-2xl border border-white/10 bg-[#161622] px-4 py-2.5 shadow-lg">
                <Award className="h-6 w-6 text-amber-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Longest Streak</div>
                  <div className="font-brand text-lg font-black text-white">
                    {data?.longestStreak || 0} <span className="text-xs font-normal text-amber-400">Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Total Solved Card */}
          <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-5 shadow-xl">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Solved Problems</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="font-brand text-3xl font-black text-white">{stats.totalSolved}</span>
              <span className="text-xs text-gray-400 font-mono">/ {stats.totalProblems} total</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1b1b26]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                style={{ width: `${solvedPct}%` }}
              />
            </div>
            <div className="mt-2 text-right text-[10px] font-mono text-gray-400">
              {solvedPct}% completed
            </div>
          </div>

          {/* Easy breakdown */}
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0f0f16] p-5 shadow-xl">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
              <span>Easy Difficulty</span>
              <span className="text-[11px] font-mono">
                {stats.easy.solved} / {stats.easy.total}
              </span>
            </div>
            <div className="mt-3 font-brand text-2xl font-black text-emerald-400">
              {stats.easy.total > 0 ? Math.round((stats.easy.solved / stats.easy.total) * 100) : 0}%
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1b1b26]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${stats.easy.total > 0 ? (stats.easy.solved / stats.easy.total) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 text-[10px] text-gray-400">Foundation and patterns</div>
          </div>

          {/* Medium breakdown */}
          <div className="rounded-2xl border border-amber-500/20 bg-[#0f0f16] p-5 shadow-xl">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
              <span>Medium Difficulty</span>
              <span className="text-[11px] font-mono">
                {stats.medium.solved} / {stats.medium.total}
              </span>
            </div>
            <div className="mt-3 font-brand text-2xl font-black text-amber-400">
              {stats.medium.total > 0 ? Math.round((stats.medium.solved / stats.medium.total) * 100) : 0}%
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1b1b26]">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${stats.medium.total > 0 ? (stats.medium.solved / stats.medium.total) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 text-[10px] text-gray-400">Core interview standard</div>
          </div>

          {/* Hard breakdown */}
          <div className="rounded-2xl border border-red-500/20 bg-[#0f0f16] p-5 shadow-xl">
            <div className="flex items-center justify-between text-red-400 text-xs font-bold">
              <span>Hard Difficulty</span>
              <span className="text-[11px] font-mono">
                {stats.hard.solved} / {stats.hard.total}
              </span>
            </div>
            <div className="mt-3 font-brand text-2xl font-black text-red-400">
              {stats.hard.total > 0 ? Math.round((stats.hard.solved / stats.hard.total) * 100) : 0}%
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1b1b26]">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${stats.hard.total > 0 ? (stats.hard.solved / stats.hard.total) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 text-[10px] text-gray-400">Advanced algorithmic mastery</div>
          </div>
        </div>

        {/* Heatmap & Topic Breakdown Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Activity Heatmap */}
          <div className="rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-6 shadow-xl lg:col-span-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-400" />
                <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                  Submission Activity Heatmap
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {data?.totalSubmissionsCount || 0} Total Submissions
              </span>
            </div>

            {/* Heatmap Grid */}
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
                {heatmapDays.map((day, idx) => {
                  let bg = 'bg-[#14141e] border-white/5';
                  if (day.count >= 4) bg = 'bg-orange-500 shadow-[0_0_8px_#f97316]';
                  else if (day.count >= 2) bg = 'bg-orange-600/80';
                  else if (day.count >= 1) bg = 'bg-orange-800/60';

                  return (
                    <div
                      key={idx}
                      title={`${day.date}: ${day.count} submissions`}
                      className={`h-3 w-3 rounded-sm border ${bg} transition-all hover:scale-125 cursor-pointer`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400">
              <span>Past 12 weeks of activity</span>
              <div className="flex items-center space-x-1.5">
                <span>Less</span>
                <span className="h-2.5 w-2.5 rounded-sm bg-[#14141e]" />
                <span className="h-2.5 w-2.5 rounded-sm bg-orange-900/60" />
                <span className="h-2.5 w-2.5 rounded-sm bg-orange-600/80" />
                <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Submission Accuracy Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-6 shadow-xl lg:col-span-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                  Submission Accuracy
                </h3>
              </div>
              <div className="mt-6 flex flex-col items-center justify-center text-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-orange-500/30 bg-[#12121a] shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                  <span className="font-brand text-3xl font-black text-white">
                    {data?.acceptanceRate || 0}%
                  </span>
                </div>
                <p className="mt-4 text-xs text-gray-400">Overall judge acceptance rate</p>
              </div>
            </div>
            <Link
              to="/problems"
              className="mt-6 flex items-center justify-center space-x-1.5 rounded-xl border border-orange-500/30 bg-[#14141e] py-2.5 text-xs font-semibold text-orange-300 hover:border-orange-500 hover:bg-[#1c1c28]"
            >
              <span>Practice More Problems</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Recommended Questions & Recent Submissions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recommended Next Questions */}
          <div className="rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                  Recommended For You
                </h3>
              </div>
              <Link to="/problems" className="text-xs text-orange-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {(data?.recommended || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  🎉 You have completed all currently recommended problems!
                </div>
              ) : (
                data?.recommended.map((p) => (
                  <Link
                    key={p.id}
                    to={`/problems/${p.slug}`}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#12121a] p-3 text-xs transition-colors hover:border-orange-500/40 hover:bg-[#181824]"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-gray-400">{p.id}.</span>
                      <span className="font-semibold text-white">{p.title}</span>
                      <span className="rounded bg-[#1a1a26] px-2 py-0.5 text-[10px] text-gray-400">
                        {p.topic_name || p.topic_slug}
                      </span>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        p.difficulty === 'Easy'
                          ? 'text-emerald-400'
                          : p.difficulty === 'Medium'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                  Recent Submissions
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">Last 6 Runs</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {(data?.recentSubmissions || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No submissions yet. Pick a problem and run your first solution!
                </div>
              ) : (
                data?.recentSubmissions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#12121a] p-3 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s.verdict === 'Accepted' ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                      <Link
                        to={`/problems/${s.problem_slug}`}
                        className="font-semibold text-white hover:text-orange-400"
                      >
                        {s.problem_title}
                      </Link>
                      <span className="font-mono text-[10px] uppercase text-gray-400">
                        {s.language}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] font-mono">
                      <span
                        className={`font-semibold ${
                          s.verdict === 'Accepted' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {s.verdict}
                      </span>
                      <span className="text-gray-400">{s.execution_time_ms}ms</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bookmarked Problems */}
        {data?.bookmarks && data.bookmarks.length > 0 && (
          <div className="mt-8 rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-6 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Bookmark className="h-4 w-4 text-orange-400" />
              <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                Bookmarked Problems ({data.bookmarks.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.bookmarks.map((bm) => (
                <Link
                  key={bm.id}
                  to={`/problems/${bm.slug}`}
                  className="rounded-xl border border-white/5 bg-[#12121a] p-3 text-xs transition-colors hover:border-orange-500/40 hover:bg-[#181824]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{bm.title}</span>
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
                  <div className="mt-2 text-[10px] text-gray-400">{bm.topic_name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
