# ALGOVORTEX — The Premier DSA Learning Platform & Online Judge

> **Brand**: ALGOVORTEX  
> **Tagline**: GAME CHANGER  
> **Main Slogan**: CODE. SOLVE. CONQUER.  
> **Hero Theme**: GRINDING ERA  
> **Mascot**: Official Fox Illustration (Preserved directly from brand artwork)

---

## 🌟 Overview

**AlgoVortex** is a full-stack, production-oriented Data Structures & Algorithms (DSA) learning platform and online judge designed with a gaming-inspired, cinematic dark aesthetic. 

Unlike visual prototypes or static UI mockups, **AlgoVortex is a fully working application** powered by connected React 19 frontend components, Express.js backend REST APIs, persistent SQLite storage with automated migrations, isolated subprocess code execution sandboxing, interactive algorithm visualizers, and pedagogical AI tutoring.

---

## 🚀 Live System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │           AlgoVortex Client (Vite 8)         │
                  │   React 19 + TypeScript + Tailwind CSS       │
                  │   Monaco Editor + GSAP / Canvas Embers       │
                  └──────────────────────┬───────────────────────┘
                                         │ Proxy: /api/*
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │          Express.js Backend (Port 5000)       │
                  │   REST API + JWT Auth + Rate Limiting        │
                  └──────┬───────────────┬────────────────┬──────┘
                         │               │                │
                         ▼               ▼                ▼
           ┌───────────────────┐ ┌───────────────┐ ┌───────────────┐
           │   SQLite (WAL)    │ │ Code Sandbox  │ │  AI Tutor     │
           │  better-sqlite3   │ │ Subprocess    │ │ Local Ollama  │
           │  Persistent DB    │ │ 3000ms Limit  │ │ + DSA Engine  │
           └───────────────────┘ └───────────────┘ └───────────────┘
```

---

## 🔑 Core Features Implemented

### 1. Brand Identity & Visual Design System
- **Original Fox Mascot**: Cleanly extracted and preserved as primary asset (`/assets/logo_dark.png`), used across Navbar, Hero, Login/Signup, and Footers.
- **Cinematic Dark Theme**: Deep charcoal `#07070a`, glowing amber accents `#f97316`, glowing borders, and floating ember particles (`<EmberParticles />`).
- **Typography**: Cinzel for brand serif wordmarks, Outfit for modern interface elements, and JetBrains Mono for code.

### 2. Complete Landing Page
- **Cinematic Hero**: "Think Better. Code Faster. Master DSA.", glowing lens flare divider, metallic 3D "GRINDING ERA" graphic, and interactive IDE preview.
- **6 Core Pillars**: Curated Problems, Step-by-Step Visualizer, Pedagogical AI Hints, Habit Streaks & Heatmap, Contests, Leaderboard.
- **16 Topic Categories**: Grid displaying problem counts across all algorithmic domains.
- **Feature Comparison Matrix & FAQ Accordion**.

### 3. Authentication & Account Management
- **Matching Design Reference**: Split layout matching Image 3 with left-column brand badge and right-column floating glass card.
- **Real JWT Sessions**: Bcrypt password hashing, session persistence, automatic token validation.
- **Demo Accounts Pre-Seeded**:
  - **Student Account**: `demo@algovortex.com` / `GrindEra@2026`
  - **Admin Account**: `admin@algovortex.com` / `AlgoAdmin@2026`

### 4. User Dashboard & Heatmap
- Total solved breakdown (Easy, Medium, Hard with live progress bars).
- Submission acceptance rate calculation.
- **365-Day Activity Heatmap**: Visualizes real daily submission frequency.
- Current streak and longest streak counter with animated flame icon.
- Recommended next problems and bookmarked questions.

### 5. Algorithmic Problem Library
- Pre-seeded with 15+ curated LeetCode-style problems across Arrays, Two Pointers, Stacks, Binary Search, Trees, Graphs, Dynamic Programming, Intervals, Heaps, and Bit Manipulation.
- Real-time search, difficulty filter, topic filter, status filter (solved/unsolved), and pagination.
- Bookmark toggling with instant database persistence.

### 6. Professional Coding Workspace
- **Monaco Editor**: Multi-language support (Python 3, JavaScript Node.js, Java, C++).
- **Subprocess Code Runner Sandbox**:
  - Sample test cases and hidden test cases.
  - 3000ms execution timeout to prevent infinite loops.
  - Memory limit and process isolation.
  - Detailed verdicts: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Runtime Error`.
  - Hidden tests kept strictly private on backend.
  - Celebratory confetti animation on accepted verdict.

### 7. Interactive Algorithm Visualizer
- **Searching**: Linear Search, Binary Search with dynamic left/right/mid pointers and step explanations.
- **Sorting**: Bubble Sort, Selection Sort with real-time bar height swapping and sorted partition highlights.
- **Data Structures**: Interactive Stack (push/pop/peek with LIFO tube) and Queue (enqueue/dequeue with FIFO pipe).
- **Controls**: Play/Pause, Step Forward, Step Back, Reset, Speed Slider, and Randomize Input.

### 8. Pedagogical AI Coding Mentor
- Embedded AI Tutor in Workspace and global endpoints.
- Connects to local Ollama (`http://localhost:11434`) if active.
- Seamlessly falls back to our **Smart DSA Pedagogical Engine** on low-RAM machines without failing.
- Modes: Progressive Hints, Big-O Complexity Breakdown, Code Debugging, and Invariant Explanations.

### 9. Learning Roadmaps & Contests
- 3 Tracks: Beginner 0 to 1, SDE Sheet 75, Advanced Graphs & DP.
- Competitive arena with live and upcoming contests.

### 10. Admin Portal & Telemetry
- System uptime, total user count, total submissions, problem publishing form with test case creator.

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
- **Node.js** (v18+ or v24+)
- **npm** (v9+)
- **Python 3** (Optional for local Python sandbox execution; already pre-detected)

### 1. Start Backend Server
```powershell
cd algovortex/backend
npm install
npm run seed     # Seeds problems, topics, admin, and demo users
npm run dev      # Starts API on http://localhost:5000
```

### 2. Start Frontend Server
```powershell
cd algovortex/frontend
npm install
npm run dev      # Starts Vite on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=algovortex_super_secret_jwt_key_grinding_era_2026
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:1.5b
JUDGE0_API_URL=
JUDGE0_API_KEY=
```

---

## 🧪 Testing Commands

```powershell
# Run backend health check
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get

# Run frontend production build
cd algovortex/frontend
npm run build
```

---

## 📜 License
AlgoVortex &copy; 2026. Built for coders. Driven by passion.
