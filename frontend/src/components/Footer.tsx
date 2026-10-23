import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Terminal, Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-orange-500/20 bg-[#07070a] pt-12 pb-8 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-[#121118] p-1">
                <img src="/assets/logo_dark.png" alt="AlgoVortex" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-brand text-base font-extrabold tracking-wider text-orange-100">
                  ALGOVORTEX
                </div>
                <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-orange-400">
                  GAME CHANGER
                </div>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              The premier cinematic DSA learning platform and online judge. Built for elite competitive coders, students, and engineers entering their grinding era.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400/90">
              <span>CODE. SOLVE. CONQUER.</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/problems" className="hover:text-orange-400 transition-colors">
                  DSA Problem Library
                </Link>
              </li>
              <li>
                <Link to="/visualizer" className="hover:text-orange-400 transition-colors">
                  Interactive Algorithm Visualizer
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-orange-400 transition-colors">
                  Curated SDE Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/contests" className="hover:text-orange-400 transition-colors">
                  Live Coding Contests
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-orange-400 transition-colors">
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics Covered */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-white">
              Mastery Topics
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/problems?topic=arrays-hashing" className="hover:text-orange-400 transition-colors">
                  Arrays & Hash Maps
                </Link>
              </li>
              <li>
                <Link to="/problems?topic=two-pointers" className="hover:text-orange-400 transition-colors">
                  Two Pointers & Sliding Window
                </Link>
              </li>
              <li>
                <Link to="/problems?topic=trees" className="hover:text-orange-400 transition-colors">
                  Binary Trees & BST
                </Link>
              </li>
              <li>
                <Link to="/problems?topic=graphs" className="hover:text-orange-400 transition-colors">
                  Graph Traversal (BFS / DFS)
                </Link>
              </li>
              <li>
                <Link to="/problems?topic=dynamic-programming" className="hover:text-orange-400 transition-colors">
                  Dynamic Programming
                </Link>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-white">
              System Architecture
            </h4>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SQLite Database Engine: Online</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Isolated Code Runner: Ready</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-400">
                <Cpu className="h-3.5 w-3.5 text-orange-400" />
                <span>AI Tutor: Pedagogical DSA Engine</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Submissions evaluated in secure sub-processes with 3000ms timeouts and strict buffer limits.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner matching Image 3 footer */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="font-mono text-xs tracking-widest text-orange-400/90 font-medium">
            BUILT FOR CODERS. DRIVEN BY PASSION. &lt;/&gt;
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            &copy; {new Date().getFullYear()} AlgoVortex. All rights reserved. Powered by the Grinding Era.
          </p>
        </div>
      </div>
    </footer>
  );
};
