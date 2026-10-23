import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { api } from '../services/api';
import { Roadmap } from '../types';
import {
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('beginner-zero-to-one');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await api.getRoadmaps();
        setRoadmaps(res.roadmaps);
        if (res.roadmaps.length > 0) {
          setSelectedSlug(res.roadmaps[0].slug);
        }
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const currentRoadmap = roadmaps.find((r) => r.slug === selectedSlug);

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <span className="font-brand text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
              CURATED PROGRESSION
            </span>
            <h1 className="mt-1 font-brand text-3xl font-black text-white sm:text-4xl">
              SDE Learning Roadmaps
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Prerequisite-ordered milestones designed to turn foundational knowledge into high-performance interview execution.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400">Active Paths:</span>
            <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 font-bold text-orange-400 border border-orange-500/30">
              {roadmaps.length} Tracks
            </span>
          </div>
        </div>

        {/* Roadmap Selector Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {roadmaps.map((r) => {
            const isSelected = r.slug === selectedSlug;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedSlug(r.slug)}
                className={`flex flex-col text-left rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-orange-500/70 bg-[#12111a] shadow-[0_0_30px_rgba(249,115,22,0.18)]'
                    : 'border-white/5 bg-[#0e0e14] hover:border-orange-500/30 hover:bg-[#12121a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      r.level === 'Beginner'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        : r.level === 'Intermediate'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                        : 'bg-red-950/60 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {r.level}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-400 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{r.estimated_hours}h</span>
                  </div>
                </div>

                <h3 className="mt-3 font-brand text-base font-bold text-white">{r.title}</h3>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">{r.description}</p>

                <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
                  <span className="text-gray-400 font-mono">{r.total_steps} Milestones</span>
                  <span className="font-semibold text-orange-400 flex items-center space-x-1">
                    <span>{isSelected ? 'Viewing' : 'Select Track'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Roadmap Timeline / Milestones */}
        {currentRoadmap && (
          <div className="mt-10 rounded-3xl border border-orange-500/20 bg-[#0e0e14] p-8 shadow-2xl">
            <div className="flex flex-col justify-between space-y-2 border-b border-white/10 pb-6 md:flex-row md:items-center md:space-y-0">
              <div>
                <h2 className="font-brand text-2xl font-black text-white">{currentRoadmap.title}</h2>
                <p className="text-xs text-gray-400 mt-1">{currentRoadmap.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-orange-400 font-mono">
                <Sparkles className="h-4 w-4" />
                <span>Estimated completion: {currentRoadmap.estimated_hours} hours</span>
              </div>
            </div>

            {/* Vertical Tree Timeline */}
            <div className="mt-8 space-y-6">
              {currentRoadmap.items.map((item, idx) => (
                <div key={idx} className="relative flex items-start space-x-4">
                  {/* Step connector line */}
                  {idx < currentRoadmap.items.length - 1 && (
                    <div className="absolute left-4 top-8 -bottom-6 w-0.5 bg-orange-500/20" />
                  )}

                  {/* Step icon number */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-500/40 bg-[#161622] font-brand text-xs font-bold text-orange-400 shadow-md">
                    {item.step}
                  </div>

                  {/* Step card */}
                  <div className="flex-1 rounded-2xl border border-white/5 bg-[#12121a] p-4 transition-all hover:border-orange-500/30">
                    <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-brand text-sm font-bold text-white">{item.title}</h4>
                          <span className="rounded bg-[#1a1a26] px-2 py-0.5 text-[10px] text-gray-400">
                            {item.topic}
                          </span>
                        </div>
                      </div>

                      {item.problemSlug ? (
                        <Link
                          to={`/problems/${item.problemSlug}`}
                          className="inline-flex items-center space-x-1.5 rounded-xl border border-orange-500/40 bg-orange-950/20 px-3.5 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-900/40 transition-colors"
                        >
                          <span>Solve Practice Problem</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                          Theoretical Concept
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
