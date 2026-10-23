import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './db/seed.js';

import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import executeRoutes from './routes/execute.js';
import dashboardRoutes from './routes/dashboard.js';
import leaderboardRoutes from './routes/leaderboard.js';
import roadmapRoutes from './routes/roadmap.js';
import contestRoutes from './routes/contests.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger in dev
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'AlgoVortex API',
    brand: 'ALGOVORTEX — GAME CHANGER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🔥 ALGOVORTEX BACKEND RUNNING ON http://localhost:${PORT}`);
      console.log(`⚡ Slogan: CODE. SOLVE. CONQUER. | Theme: GRINDING ERA`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start AlgoVortex backend:', error);
    process.exit(1);
  }
}

startServer();
