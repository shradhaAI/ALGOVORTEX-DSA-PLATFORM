import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { optionalAuth, requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get topics with problem counts
router.get('/topics', (_req, res: Response): void => {
  try {
    const topics = db.prepare(`
      SELECT t.*, COUNT(p.id) as problem_count
      FROM topics t
      LEFT JOIN problems p ON t.slug = p.topic_slug
      GROUP BY t.id
      ORDER BY t.order_index ASC
    `).all();

    res.json({ success: true, topics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch topics.' });
  }
});

// List problems with filters and pagination
router.get('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const search = (req.query.search as string) || '';
    const topic = (req.query.topic as string) || '';
    const difficulty = (req.query.difficulty as string) || '';
    const status = (req.query.status as string) || ''; // 'solved', 'unsolved', or ''
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.id, p.title, p.slug, p.difficulty, p.topic_slug,
             p.acceptance_rate, p.total_submissions, p.total_accepted,
             t.name as topic_name
    `;

    if (req.user) {
      query += `,
        CASE WHEN up.status = 'solved' THEN 1 ELSE 0 END as is_solved,
        CASE WHEN bm.id IS NOT NULL THEN 1 ELSE 0 END as is_bookmarked
      `;
    } else {
      query += `, 0 as is_solved, 0 as is_bookmarked`;
    }

    query += `
      FROM problems p
      LEFT JOIN topics t ON p.topic_slug = t.slug
    `;

    if (req.user) {
      query += `
        LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ${req.user.id}
        LEFT JOIN bookmarks bm ON p.id = bm.problem_id AND bm.user_id = ${req.user.id}
      `;
    }

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(p.title LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (topic && topic !== 'all') {
      conditions.push('p.topic_slug = ?');
      params.push(topic);
    }

    if (difficulty && difficulty !== 'all') {
      conditions.push('p.difficulty = ?');
      params.push(difficulty);
    }

    if (req.user && status === 'solved') {
      conditions.push("up.status = 'solved'");
    } else if (req.user && status === 'unsolved') {
      conditions.push("(up.status IS NULL OR up.status != 'solved')");
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const problems = db.prepare(query).all(...params);

    // Count total
    let countQuery = 'SELECT COUNT(p.id) as total FROM problems p';
    if (req.user && (status === 'solved' || status === 'unsolved')) {
      countQuery += ` LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ${req.user.id}`;
    }
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = db.prepare(countQuery).get(...params.slice(0, -2)) as { total: number };

    res.json({
      success: true,
      problems,
      pagination: {
        page,
        limit,
        total: countResult ? countResult.total : problems.length,
        totalPages: Math.ceil((countResult ? countResult.total : problems.length) / limit),
      },
    });
  } catch (error: any) {
    console.error('[Problems] Fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve problems.' });
  }
});

// Get user bookmarks
router.get('/user/bookmarks', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const bookmarks = db.prepare(`
      SELECT p.id, p.title, p.slug, p.difficulty, p.topic_slug, p.acceptance_rate,
             t.name as topic_name, bm.created_at as bookmarked_at,
             CASE WHEN up.status = 'solved' THEN 1 ELSE 0 END as is_solved
      FROM bookmarks bm
      JOIN problems p ON bm.problem_id = p.id
      LEFT JOIN topics t ON p.topic_slug = t.slug
      LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = bm.user_id
      WHERE bm.user_id = ?
      ORDER BY bm.created_at DESC
    `).all(req.user!.id);

    res.json({ success: true, bookmarks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookmarks.' });
  }
});

// Toggle bookmark
router.post('/:id/bookmark', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const problemId = parseInt(String(req.params.id), 10);
    const userId = req.user!.id;

    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND problem_id = ?').get(userId, problemId);

    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND problem_id = ?').run(userId, problemId);
      res.json({ success: true, isBookmarked: false, message: 'Bookmark removed.' });
    } else {
      db.prepare('INSERT INTO bookmarks (user_id, problem_id) VALUES (?, ?)').run(userId, problemId);
      res.json({ success: true, isBookmarked: true, message: 'Problem added to bookmarks.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle bookmark.' });
  }
});

// Get single problem details
router.get('/:slugOrId', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const param = String(req.params.slugOrId);
    const isNumeric = /^\d+$/.test(param);

    const problem = db.prepare(`
      SELECT p.*, t.name as topic_name
      FROM problems p
      LEFT JOIN topics t ON p.topic_slug = t.slug
      WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
    `).get(param) as any;

    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    // Parse JSON fields
    problem.examples = JSON.parse(problem.examples_json || '[]');
    problem.hints = JSON.parse(problem.hints_json || '[]');
    problem.starterCode = JSON.parse(problem.starter_code_json || '{}');
    delete problem.examples_json;
    delete problem.hints_json;
    delete problem.starter_code_json;

    // Fetch sample test cases ONLY (do not expose hidden test cases in problem details)
    const sampleTestCases = db.prepare(`
      SELECT id, input, expected_output, is_sample, explanation
      FROM test_cases
      WHERE problem_id = ? AND is_sample = 1
    `).all(problem.id);

    problem.sampleTestCases = sampleTestCases;

    // Check user solved/bookmarked state if authenticated
    if (req.user) {
      const progress = db.prepare('SELECT status FROM user_progress WHERE user_id = ? AND problem_id = ?').get(
        req.user.id,
        problem.id
      ) as { status: string } | undefined;
      problem.isSolved = progress?.status === 'solved';

      const bm = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND problem_id = ?').get(
        req.user.id,
        problem.id
      );
      problem.isBookmarked = !!bm;

      // Fetch user's previous submissions for this problem
      const userSubmissions = db.prepare(`
        SELECT id, language, verdict, execution_time_ms, memory_kb, test_cases_passed, total_test_cases, created_at
        FROM submissions
        WHERE user_id = ? AND problem_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `).all(req.user.id, problem.id);
      problem.userSubmissions = userSubmissions;
    } else {
      problem.isSolved = false;
      problem.isBookmarked = false;
      problem.userSubmissions = [];
    }

    res.json({ success: true, problem });
  } catch (error: any) {
    console.error('[Problems] Get detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch problem details.' });
  }
});

export default router;
