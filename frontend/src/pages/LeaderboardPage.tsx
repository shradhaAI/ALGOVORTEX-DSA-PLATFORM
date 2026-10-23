import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Crown, Star, Flame, Award, CheckCircle2 } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await api.getLeaderboard();
        setLeaderboard(res.leaderboard);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-semibold text-orange-400">
            <Trophy className="h-3.5 w-3.5" />
            <span className="uppercase font-brand tracking-widest">GLOBAL STANDINGS</span>
          </div>
          <h1 className="mt-3 font-brand text-3xl font-black text-white sm:text-4xl">
            AlgoVortex Leaderboard
          </h1>
          <p className="mt-2 text-xs text-gray-400 max-w-md mx-auto">
            Scored dynamically: Easy = 20 pts &bull; Medium = 50 pts &bull; Hard = 100 pts. Ranked by total score and verified submissions.
          </p>
        </div>

        {/* Podium for Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto items-end">
            {/* Rank 2 (Silver) */}
            <div className="flex flex-col items-center rounded-2xl border border-gray-400/30 bg-[#0e0e15] p-6 text-center shadow-xl order-2 sm:order-1">
              <Medal className="h-8 w-8 text-gray-300 mb-2" />
              <div className="h-14 w-14 rounded-full border-2 border-gray-400 bg-orange-700/40 flex items-center justify-center font-brand font-black text-white text-lg">
                {leaderboard[1].username.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-2 font-brand text-sm font-bold text-white">{leaderboard[1].username}</h3>
              <span className="text-[10px] text-gray-400">{leaderboard[1].full_name}</span>
              <div className="mt-3 font-mono font-bold text-sm text-gray-300">{leaderboard[1].score} pts</div>
              <span className="text-[10px] text-gray-400">{leaderboard[1].total_solved} solved</span>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="flex flex-col items-center rounded-3xl border border-amber-500/50 bg-[#14141e] p-8 text-center shadow-[0_0_40px_rgba(245,158,11,0.25)] order-1 sm:order-2 scale-105">
              <Crown className="h-10 w-10 text-amber-400 mb-2 animate-bounce" />
              <div className="h-16 w-16 rounded-full border-2 border-amber-400 bg-amber-600/30 flex items-center justify-center font-brand font-black text-amber-200 text-xl shadow-lg">
                {leaderboard[0].username.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-2 font-brand text-base font-extrabold text-amber-300">{leaderboard[0].username}</h3>
              <span className="text-xs text-gray-300">{leaderboard[0].full_name}</span>
              <div className="mt-3 font-mono font-black text-lg text-amber-400">{leaderboard[0].score} pts</div>
              <span className="text-xs text-gray-400">{leaderboard[0].total_solved} solved</span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="flex flex-col items-center rounded-2xl border border-amber-700/30 bg-[#0e0e15] p-6 text-center shadow-xl order-3">
              <Medal className="h-8 w-8 text-amber-700 mb-2" />
              <div className="h-14 w-14 rounded-full border-2 border-amber-700 bg-amber-900/40 flex items-center justify-center font-brand font-black text-white text-lg">
                {leaderboard[2].username.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-2 font-brand text-sm font-bold text-white">{leaderboard[2].username}</h3>
              <span className="text-[10px] text-gray-400">{leaderboard[2].full_name}</span>
              <div className="mt-3 font-mono font-bold text-sm text-amber-600">{leaderboard[2].score} pts</div>
              <span className="text-[10px] text-gray-400">{leaderboard[2].total_solved} solved</span>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-orange-500/20 bg-[#0d0d14] shadow-2xl">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#11111a] text-gray-400">
                    <th className="w-16 p-4 text-center">Rank</th>
                    <th className="p-4 font-bold text-gray-200">Coder</th>
                    <th className="p-4 font-bold text-gray-200">Total Solved</th>
                    <th className="p-4 font-bold text-emerald-400">Easy</th>
                    <th className="p-4 font-bold text-amber-400">Medium</th>
                    <th className="p-4 font-bold text-red-400">Hard</th>
                    <th className="p-4 font-bold text-orange-400 text-right">Algo Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leaderboard.map((user, idx) => (
                    <tr key={user.id} className="transition-colors hover:bg-orange-500/5">
                      <td className="p-4 text-center font-brand font-bold text-gray-300">
                        {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600/30 text-orange-300 font-bold font-mono">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.username}</div>
                            <div className="text-[10px] text-gray-400">{user.full_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-white">{user.total_solved}</td>
                      <td className="p-4 font-mono text-emerald-400">{user.easy_solved}</td>
                      <td className="p-4 font-mono text-amber-400">{user.medium_solved}</td>
                      <td className="p-4 font-mono text-red-400">{user.hard_solved}</td>
                      <td className="p-4 font-mono font-bold text-orange-400 text-right text-sm">
                        {user.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
