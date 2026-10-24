import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import { api } from '../services/api';
import { Topic } from '../types';
import {
  Code2,
  Sparkles,
  Map,
  Trophy,
  BarChart3,
  Flame,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Zap,
  Terminal,
  Shield,
  HelpCircle,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  Maximize2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // ── Intro Video State ──────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoDismissed, setVideoDismissed] = useState(false);
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const handlePlayIntro = useCallback(() => {
    setVideoVisible(true);
    setVideoEnded(false);
    setVideoError(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => setVideoError(true));
        setVideoPlaying(true);
      }
    }, 100);
  }, []);

  const handleTogglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setVideoPlaying(true); }
    else { v.pause(); setVideoPlaying(false); }
  };

  const handleToggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  };

  const handleSkip = () => {
    setVideoVisible(false);
    setVideoDismissed(true);
    setVideoPlaying(false);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleVideoEnded = () => {
    setVideoPlaying(false);
    setVideoEnded(true);
  };

  const handleReplay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setVideoPlaying(true);
    setVideoEnded(false);
  };

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await api.getTopics();
        setTopics(res.topics.slice(0, 12));
      } catch {
        // Fallback
      }
    }
    loadTopics();
  }, []);

  const faqs = [
    {
      q: 'How is AlgoVortex different from traditional coding platforms?',
      a: 'AlgoVortex unites a cinematic, distraction-free IDE with step-by-step interactive algorithm visualizers, an AI coding mentor that gives progressive hints without spoiling code, and structured SDE roadmaps—all evaluated on a secure sandboxed online judge.',
    },
    {
      q: 'Can I run and submit solutions in multiple programming languages?',
      a: 'Yes. AlgoVortex supports Python 3, JavaScript (Node.js), Java, and C++. Submissions are executed in isolated processes with strict memory and time limits, evaluating both sample cases and protected hidden edge cases.',
    },
    {
      q: 'Does the AI Tutor reveal answers right away?',
      a: 'No. The AlgoVortex AI Tutor is designed pedagogically. It first breaks down intuition, highlights invariant patterns, and guides you with progressive nudges so you truly understand the problem before seeing the code.',
    },
    {
      q: 'Is AlgoVortex suitable for beginners?',
      a: 'Absolutely. We provide a dedicated "Beginner 0 to 1" roadmap covering Big-O analysis, fundamental arrays, and two-pointer basics before moving to intermediate dynamic programming and graphs.',
    },
    {
      q: 'Are my submissions, streaks, and bookmarks saved?',
      a: 'Yes. All progress, submission history, test case verdicts, daily streaks, and bookmarked questions are persistently stored in our SQLite database engine and reflect instantly on your personal dashboard.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      {/* ── CINEMATIC INTRO VIDEO OVERLAY ───────────────────────────────────── */}
      {videoVisible && !videoDismissed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Dark orange vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0305_100%)]" />

          <div className="relative w-full max-w-4xl mx-4">
            {/* Title badge */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/assets/logo_dark.png" alt="AlgoVortex" className="h-8 w-auto" />
                <div>
                  <p className="font-brand text-sm font-black text-white uppercase tracking-widest">AlgoVortex</p>
                  <p className="font-mono text-[10px] text-orange-400 tracking-[0.25em]">GAME CHANGER</p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="flex items-center space-x-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" />
                <span>Skip Intro</span>
              </button>
            </div>

            {/* Video container */}
            <div className="relative overflow-hidden rounded-2xl border border-orange-500/40 shadow-[0_0_60px_rgba(249,115,22,0.25)]">
              {videoError ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-[#0d0d13] text-center">
                  <Flame className="h-12 w-12 text-orange-500/50" />
                  <div>
                    <p className="font-brand font-bold text-white">Video Unavailable</p>
                    <p className="mt-1 text-xs text-gray-400">Ensure algovortex-intro.mp4 is in public/videos/</p>
                  </div>
                  <button onClick={handleSkip} className="glow-btn-fire rounded-xl px-6 py-2 text-sm font-bold text-white">
                    Enter Platform
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/assets/cinematic_bg.jpg"
                    onEnded={handleVideoEnded}
                    onError={() => setVideoError(true)}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                  >
                    <source src="/videos/algovortex-intro.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>

                  {/* Orange overlay gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Controls bar */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={videoEnded ? handleReplay : handleTogglePlay}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-400 transition-colors"
                        title={videoEnded ? 'Replay' : videoPlaying ? 'Pause' : 'Play'}
                      >
                        {videoEnded ? (
                          <Play className="h-4 w-4" />
                        ) : videoPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={handleToggleMute}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        title={videoMuted ? 'Unmute' : 'Mute'}
                      >
                        {videoMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {videoEnded && (
                        <Link
                          to="/problems"
                          onClick={handleSkip}
                          className="glow-btn-fire flex items-center space-x-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow"
                        >
                          <span>Start Coding</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* "CODE. SOLVE. CONQUER." tagline below video */}
            <p className="mt-3 text-center font-mono text-xs font-bold tracking-[0.3em] text-orange-400/70">
              CODE. SOLVE. CONQUER.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[90vh] flex-col justify-center overflow-hidden px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        {/* Subtle orange glow orb */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/15 blur-[120px]" />

        <div className="mx-auto max-w-6xl text-center">
          {/* Grinding Era Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-4 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span className="tracking-widest uppercase font-brand">THE GRINDING ERA HAS BEGUN</span>
          </div>

          {/* Large Headline */}
          <h1 className="mt-8 font-brand text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
            Think Better. Code Faster. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Master DSA.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 leading-relaxed sm:text-lg">
            AlgoVortex is a cinematic developer platform built for elite engineers. Practice curated algorithmic problems, inspect live data structure animations, receive progressive AI hints, and conquer technical interviews.
          </p>

          {/* Slogan */}
          <div className="mt-4 font-mono text-xs font-bold tracking-[0.3em] text-orange-400/90">
            CODE. SOLVE. CONQUER.
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-5">
            <Link
              to="/problems"
              className="glow-btn-fire flex w-full items-center justify-center space-x-2.5 rounded-xl px-8 py-4 text-base font-bold text-white shadow-xl transition-all sm:w-auto"
            >
              <span>Start Coding</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            {!videoDismissed && !prefersReducedMotion && (
              <button
                onClick={handlePlayIntro}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border border-orange-500/50 bg-orange-950/30 px-8 py-4 text-base font-semibold text-orange-300 transition-all hover:border-orange-400 hover:bg-orange-900/40 sm:w-auto"
              >
                <Play className="h-5 w-5 fill-orange-400 text-orange-400" />
                <span>Watch Intro</span>
              </button>
            )}
            <Link
              to="/visualizer"
              className="flex w-full items-center justify-center space-x-2 rounded-xl border border-orange-500/30 bg-[#14141e] px-8 py-4 text-base font-semibold text-gray-200 transition-all hover:border-orange-500 hover:bg-[#1a1a26] sm:w-auto"
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Explore Visualizers</span>
            </Link>
          </div>

          {/* Cinematic Hero Video Player (Always Visible, Responsive, Poster Fallback, Controls) */}
          <div className="relative mt-12 mx-auto max-w-5xl rounded-2xl border border-orange-500/40 bg-[#0d0d13]/95 p-3 shadow-[0_0_60px_rgba(249,115,22,0.25)] backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-gray-300 font-medium tracking-wider">
                  ALGOVORTEX // OFFICIAL ANIME TRAILER & PLATFORM PREVIEW
                </span>
              </div>
              <div className="flex items-center space-x-2 text-orange-400 font-mono text-[11px] font-bold">
                <Flame className="h-3.5 w-3.5 animate-pulse" />
                <span>GRINDING ERA</span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative overflow-hidden rounded-xl bg-black aspect-video max-h-[520px] flex items-center justify-center">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/assets/cinematic_bg.jpg"
              >
                <source src="/videos/algovortex-intro.mp4" type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Section */}
      <section className="relative z-10 border-t border-orange-500/20 bg-[#0a0a0f] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400 font-brand">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="mt-2 font-brand text-3xl font-black text-white sm:text-4xl">
              Engineered For Algorithmic Mastery
            </h2>
            <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
              Everything required to progress from syntax fundamentals to Tier-1 engineering problem-solving.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">Practice Curated DSA</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Categorized library covering all 16 core patterns from Arrays, Two Pointers, and Binary Search to Trees, Graphs, and Dynamic Programming.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">Learn Algorithms Visually</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Interactive step-by-step visualizers for Sorting (Merge, Quick, Bubble), Searching, Linked Lists, Trees, and Graph BFS/DFS traversal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">AI Pedagogical Hints</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Get progressive intuition and complexity guidance without giving away the full solution, backed by local Ollama or our smart heuristic DSA mentor.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">Persistent Analytics & Heatmap</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Full 365-day activity heatmaps, streak calculation, topic-wise mastery breakdowns, and submission histories stored in real SQLite records.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">Build Consistent Streaks</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Stay locked into the Grinding Era with streak badges, acceptance tracking, and personalized problem recommendations based on your weak spots.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-orange-500/20 bg-[#0f0f16] p-6 shadow-lg transition-all hover:border-orange-500/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-brand text-lg font-bold text-white">Competitive Arenas & Contests</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Participate in timed weekly challenges and test your speed against peers on our global difficulty-weighted leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid Preview */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400 font-brand">
                CURRICULUM
              </span>
              <h2 className="font-brand text-2xl font-black text-white sm:text-3xl">
                16 Core DSA Topics
              </h2>
            </div>
            <Link
              to="/problems"
              className="flex items-center space-x-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
            >
              <span>View all problems</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/problems?topic=${t.slug}`}
                className="flex flex-col items-center rounded-xl border border-white/5 bg-[#101018] p-4 text-center transition-all hover:border-orange-500/50 hover:bg-[#161622]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="mt-2.5 text-xs font-bold text-gray-200">{t.name}</span>
                <span className="mt-1 text-[10px] text-gray-400">
                  {t.problem_count || 0} problems
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="relative z-10 border-t border-orange-500/20 bg-[#0a0a0f] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-brand text-2xl font-black text-white sm:text-3xl">
              Why Engineers Choose AlgoVortex
            </h2>
            <p className="mt-2 text-xs text-gray-400">
              Clear breakdown of platform capabilities compared to traditional judges
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-orange-500/20 bg-[#0e0e14] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#12121c] text-gray-300">
                    <th className="p-4 font-bold">Feature</th>
                    <th className="p-4 font-bold text-orange-400">AlgoVortex</th>
                    <th className="p-4 font-bold text-gray-400">Standard Platforms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-4 font-medium text-white">Original Fox Brand Identity</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" /> <span>Official Mascot & Cinematics</span>
                    </td>
                    <td className="p-4 text-gray-400">Generic UI</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Step-by-step Interactive Visualizers</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" /> <span>Real Step-by-Step State</span>
                    </td>
                    <td className="p-4 text-gray-400">Static Images or Video</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">AI Tutor Engine</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" /> <span>Local Ollama + Pedagogical Hints</span>
                    </td>
                    <td className="p-4 text-gray-400">Expensive Paywall or None</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Isolated Code Execution</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" /> <span>Subprocess Sandbox + Hidden Tests</span>
                    </td>
                    <td className="p-4 text-gray-400">Varies</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Lightweight Low-RAM Footprint</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4" /> <span>Optimized for 8GB Laptops</span>
                    </td>
                    <td className="p-4 text-gray-400">Heavy Browsers & High RAM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400 font-brand">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="mt-2 font-brand text-2xl font-black text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-orange-500/20 bg-[#0e0e14] transition-all hover:border-orange-500/40"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-gray-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-orange-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="border-t border-white/5 p-4 text-xs leading-relaxed text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 border-t border-orange-500/20 bg-[#0a0a0e] py-16 px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-orange-500/35 bg-gradient-to-b from-[#14141e] to-[#0a0a0f] p-10 shadow-[0_0_50px_rgba(249,115,22,0.2)]">
          <h2 className="font-brand text-3xl font-black text-white sm:text-4xl">
            Ready to Begin Your Grinding Era?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-gray-300 sm:text-sm">
            Join AlgoVortex today. Track your progress, solve algorithmic challenges, and forge elite problem-solving habits.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/signup"
              className="glow-btn-fire rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-xl"
            >
              CREATE FREE ACCOUNT
            </Link>
            <Link
              to="/problems"
              className="rounded-xl border border-white/10 bg-[#161622] px-6 py-3.5 text-sm font-semibold text-gray-200 hover:bg-[#1e1e2e]"
            >
              EXPLORE PROBLEMS
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
