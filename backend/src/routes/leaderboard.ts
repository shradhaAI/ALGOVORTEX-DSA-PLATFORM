import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  try {
    // All-time leaderboard: score = (Easy * 20) + (Medium * 50) + (Hard * 100)
    const leaderboard = db.prepare(`
      SELECT
        u.id, u.username, u.full_name, u.avatar_url,
        COUNT(DISTINCT CASE WHEN p.difficulty = 'Easy' AND up.status = 'solved' THEN p.id END) as easy_solved,
        COUNT(DISTINCT CASE WHEN p.difficulty = 'Medium' AND up.status = 'solved' THEN p.id END) as medium_solved,
        COUNT(DISTINCT CASE WHEN p.difficulty = 'Hard' AND up.status = 'solved' THEN p.id END) as hard_solved,
        COUNT(DISTINCT CASE WHEN up.status = 'solved' THEN p.id END) as total_solved,
        (
          COUNT(DISTINCT CASE WHEN p.difficulty = 'Easy' AND up.status = 'solved' THEN p.id END) * 20 +
          COUNT(DISTINCT CASE WHEN p.difficulty = 'Medium' AND up.status = 'solved' THEN p.id END) * 50 +
          COUNT(DISTINCT CASE WHEN p.difficulty = 'Hard' AND up.status = 'solved' THEN p.id END) * 100
        ) as score
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id AND up.status = 'solved'
      LEFT JOIN problems p ON up.problem_id = p.id
      GROUP BY u.id
      ORDER BY score DESC, total_solved DESC, u.created_at ASC
      LIMIT 50
    `).all();

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
});

export default router;
