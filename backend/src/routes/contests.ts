import { Router, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (_req, res: Response): void => {
  try {
    const contests = db.prepare(`SELECT * FROM contests ORDER BY start_time DESC`).all() as any[];

    const formatted = contests.map((c) => {
      const problemSlugs = JSON.parse(c.problems_json || '[]');
      return {
        ...c,
        problemSlugs,
        problemCount: problemSlugs.length,
      };
    });

    res.json({ success: true, contests: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch contests.' });
  }
});

router.get('/:slug', (req, res: Response): void => {
  try {
    const contest = db.prepare(`SELECT * FROM contests WHERE slug = ?`).get(req.params.slug) as any;

    if (!contest) {
      res.status(404).json({ success: false, message: 'Contest not found.' });
      return;
    }

    const problemSlugs = JSON.parse(contest.problems_json || '[]');
    const placeholders = problemSlugs.map(() => '?').join(',');

    let problems: any[] = [];
    if (problemSlugs.length > 0) {
      problems = db.prepare(`
        SELECT id, title, slug, difficulty, topic_slug, acceptance_rate
        FROM problems
        WHERE slug IN (${placeholders})
      `).all(...problemSlugs);
    }

    contest.problems = problems;
    delete contest.problems_json;

    res.json({ success: true, contest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch contest details.' });
  }
});

export default router;
