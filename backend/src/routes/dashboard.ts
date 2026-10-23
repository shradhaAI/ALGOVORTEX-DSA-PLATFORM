import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;

    // 1. Difficulty counts
    const difficultyTotals = db.prepare(`
      SELECT difficulty, COUNT(*) as total
      FROM problems
      GROUP BY difficulty
    `).all() as Array<{ difficulty: string; total: number }>;

    const userSolvedByDifficulty = db.prepare(`
      SELECT p.difficulty, COUNT(DISTINCT p.id) as solved
      FROM user_progress up
      JOIN problems p ON up.problem_id = p.id
      WHERE up.user_id = ? AND up.status = 'solved'
      GROUP BY p.difficulty
    `).all(userId) as Array<{ difficulty: string; solved: number }>;

    const totalProblemsCount = difficultyTotals.reduce((acc, curr) => acc + curr.total, 0);
    const totalSolvedCount = userSolvedByDifficulty.reduce((acc, curr) => acc + curr.solved, 0);

    const stats = {
      totalProblems: totalProblemsCount,
      totalSolved: totalSolvedCount,
      easy: {
        total: difficultyTotals.find((d) => d.difficulty === 'Easy')?.total || 0,
        solved: userSolvedByDifficulty.find((d) => d.difficulty === 'Easy')?.solved || 0,
      },
      medium: {
        total: difficultyTotals.find((d) => d.difficulty === 'Medium')?.total || 0,
        solved: userSolvedByDifficulty.find((d) => d.difficulty === 'Medium')?.solved || 0,
      },
      hard: {
        total: difficultyTotals.find((d) => d.difficulty === 'Hard')?.total || 0,
        solved: userSolvedByDifficulty.find((d) => d.difficulty === 'Hard')?.solved || 0,
      },
    };

    // 2. Acceptance rate
    const submissionStats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN verdict = 'Accepted' THEN 1 ELSE 0 END) as accepted
      FROM submissions
      WHERE user_id = ?
    `).get(userId) as { total: number; accepted: number | null };

    const acceptanceRate = submissionStats.total > 0
      ? Math.round(((submissionStats.accepted || 0) / submissionStats.total) * 1000) / 10
      : 0;

    // 3. Activity heatmap (by day for the last 90-365 days)
    const activityDays = db.prepare(`
      SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count
      FROM submissions
      WHERE user_id = ?
      GROUP BY strftime('%Y-%m-%d', created_at)
      ORDER BY date ASC
    `).all(userId) as Array<{ date: string; count: number }>;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (activityDays.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const activeDates = new Set(activityDays.map((a) => a.date));

      if (activeDates.has(today) || activeDates.has(yesterday)) {
        let checkDate = new Date();
        if (!activeDates.has(today)) {
          checkDate = new Date(Date.now() - 86400000);
        }
        while (true) {
          const dStr = checkDate.toISOString().split('T')[0];
          if (activeDates.has(dStr)) {
            currentStreak++;
            checkDate = new Date(checkDate.getTime() - 86400000);
          } else {
            break;
          }
        }
      }

      // Compute longest streak
      const sortedDates = [...activeDates].sort();
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]).getTime();
        const curr = new Date(sortedDates[i]).getTime();
        if (Math.round((curr - prev) / 86400000) === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    // 4. Topic-wise progress
    const topicProgress = db.prepare(`
      SELECT t.slug, t.name, t.icon,
             COUNT(p.id) as total_problems,
             COUNT(CASE WHEN up.status = 'solved' THEN 1 END) as solved_problems
      FROM topics t
      LEFT JOIN problems p ON t.slug = p.topic_slug
      LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ?
      GROUP BY t.id
      ORDER BY t.order_index ASC
    `).all(userId);

    // 5. Recent submissions
    const recentSubmissions = db.prepare(`
      SELECT s.id, s.problem_id, s.language, s.verdict, s.execution_time_ms, s.created_at,
             p.title as problem_title, p.slug as problem_slug, p.difficulty
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT 6
    `).all(userId);

    // 6. Bookmarked problems
    const bookmarks = db.prepare(`
      SELECT p.id, p.title, p.slug, p.difficulty, p.topic_slug, t.name as topic_name,
             CASE WHEN up.status = 'solved' THEN 1 ELSE 0 END as is_solved
      FROM bookmarks bm
      JOIN problems p ON bm.problem_id = p.id
      LEFT JOIN topics t ON p.topic_slug = t.slug
      LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = bm.user_id
      WHERE bm.user_id = ?
      ORDER BY bm.created_at DESC
      LIMIT 5
    `).all(userId);

    // 7. Recommended Next Questions (unsolved easy/medium problems)
    const recommended = db.prepare(`
      SELECT p.id, p.title, p.slug, p.difficulty, p.topic_slug, p.acceptance_rate, t.name as topic_name
      FROM problems p
      LEFT JOIN topics t ON p.topic_slug = t.slug
      LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ?
      WHERE up.status IS NULL OR up.status != 'solved'
      ORDER BY CASE p.difficulty WHEN 'Easy' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END ASC, p.id ASC
      LIMIT 4
    `).all(userId);

    res.json({
      success: true,
      data: {
        stats,
        acceptanceRate,
        totalSubmissionsCount: submissionStats.total,
        currentStreak,
        longestStreak,
        activityHeatmap: activityDays,
        topicProgress,
        recentSubmissions,
        bookmarks,
        recommended,
      },
    });
  } catch (error: any) {
    console.error('[Dashboard] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard data.' });
  }
});

export default router;
