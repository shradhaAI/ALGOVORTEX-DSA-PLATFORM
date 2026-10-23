import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// List all roadmaps
router.get('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const roadmaps = db.prepare(`SELECT * FROM roadmaps ORDER BY id ASC`).all() as any[];

    const formatted = roadmaps.map((r) => {
      const items = JSON.parse(r.items_json || '[]');
      return {
        ...r,
        items,
        totalItems: items.length,
      };
    });

    res.json({ success: true, roadmaps: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch roadmaps.' });
  }
});

// Single roadmap details with step completion tracking
router.get('/:slug', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const roadmap = db.prepare(`SELECT * FROM roadmaps WHERE slug = ?`).get(req.params.slug) as any;

    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found.' });
      return;
    }

    const items = JSON.parse(roadmap.items_json || '[]');

    // If user is authenticated, check which problem steps they have solved
    if (req.user) {
      const solvedProblems = db.prepare(`
        SELECT p.slug
        FROM user_progress up
        JOIN problems p ON up.problem_id = p.id
        WHERE up.user_id = ? AND up.status = 'solved'
      `).all(req.user.id) as Array<{ slug: string }>;

      const solvedSlugs = new Set(solvedProblems.map((s) => s.slug));

      items.forEach((item: any) => {
        if (item.problemSlug && solvedSlugs.has(item.problemSlug)) {
          item.isCompleted = true;
        } else {
          item.isCompleted = item.status === 'completed';
        }
      });
    }

    roadmap.items = items;
    delete roadmap.items_json;

    res.json({ success: true, roadmap });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to load roadmap details.' });
  }
});

export default router;
