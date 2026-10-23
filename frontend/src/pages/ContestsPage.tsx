import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { Trophy, Clock, Calendar, Users, ArrowRight, ShieldCheck, Play } from 'lucide-react';

interface Contest {
  id: number;
  slug: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'ended';
  problemSlugs?: string[];
  problemCount?: number;
}

export const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadContests() {
      try {
        const res = await fetch('/api/contests');
        const data = await res.json();
        if (data.success) {
          setContests(data.contests);
        }
      } catch (err) {
        console.error('Failed to load contests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContests();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <span className="font-brand text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
            COMPETITIVE ARENA
          </span>
          <h1 className="mt-1 font-brand text-3xl font-black text-white sm:text-4xl">
            AlgoVortex Contests
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Real-time algorithmic contests modeled after FAANG rounds and collegiate programming contests.
          </p>
        </div>

        {/* Contests List */}
        <div className="mt-8 space-y-6">
          {contests.map((c) => {
            const isUpcoming = c.status === 'upcoming';
            const isEnded = c.status === 'ended';

            return (
              <div
                key={c.id}
                className="rounded-3xl border border-orange-500/25 bg-[#0e0e14] p-6 shadow-xl transition-all hover:border-orange-500/50 sm:p-8"
              >
                <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isUpcoming
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                            : isEnded
                            ? 'bg-gray-800 text-gray-400 border border-gray-700'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 animate-pulse'
                        }`}
                      >
                        {c.status}
                      </span>
                      <h3 className="font-brand text-xl font-bold text-white">{c.title}</h3>
                    </div>

                    <p className="max-w-2xl text-xs text-gray-400 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-2">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-orange-400" />
                        <span>Start: {new Date(c.start_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5 text-orange-400" />
                        <span>Duration: 90 Mins</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Trophy className="h-3.5 w-3.5 text-amber-400" />
                        <span>{c.problemCount || 4} Algorithmic Challenges</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUpcoming ? (
                      <button
                        type="button"
                        onClick={() => alert(`Registered for ${c.title}! A reminder has been set.`)}
                        className="glow-btn-fire flex items-center space-x-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-lg"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Register Now</span>
                      </button>
                    ) : (
                      <Link
                        to="/problems"
                        className="flex items-center space-x-2 rounded-xl border border-white/10 bg-[#161622] px-6 py-3 text-xs font-semibold text-gray-200 hover:border-orange-500/40 hover:bg-[#1e1e2c]"
                      >
                        <span>Virtual Contest Arena</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
