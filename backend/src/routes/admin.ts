import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// Platform stats
router.get('/stats', (_req: AuthRequest, res: Response): void => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const totalProblems = db.prepare('SELECT COUNT(*) as count FROM problems').get() as { count: number };
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get() as { count: number };
    const totalAccepted = db.prepare("SELECT COUNT(*) as count FROM submissions WHERE verdict = 'Accepted'").get() as { count: number };

    const recentUsers = db.prepare(`
      SELECT id, username, email, full_name, role, created_at
      FROM users ORDER BY created_at DESC LIMIT 10
    `).all();

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers.count,
        totalProblems: totalProblems.count,
        totalSubmissions: totalSubmissions.count,
        totalAccepted: totalAccepted.count,
        uptimeSeconds: Math.floor(process.uptime()),
      },
      recentUsers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
});

// Admin problem creation
router.post('/problems', (req: AuthRequest, res: Response): void => {
  try {
    const {
      title,
      slug,
      difficulty,
      topic_slug,
      description,
      input_format,
      output_format,
      constraints,
      examples,
      hints,
      starterCode,
      editorial,
      time_complexity,
      space_complexity,
      testCases,
    } = req.body;

    if (!title || !slug || !difficulty || !topic_slug || !description) {
      res.status(400).json({ success: false, message: 'Missing required problem fields.' });
      return;
    }

    const insertProblem = db.prepare(`
      INSERT INTO problems (
        title, slug, difficulty, topic_slug, description,
        input_format, output_format, constraints,
        examples_json, hints_json, starter_code_json, editorial_markdown,
        time_complexity, space_complexity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertProblem.run(
      title,
      slug,
      difficulty,
      topic_slug,
      description,
      input_format || '',
      output_format || '',
      constraints || '',
      JSON.stringify(examples || []),
      JSON.stringify(hints || []),
      JSON.stringify(starterCode || {}),
      editorial || '',
      time_complexity || 'O(N)',
      space_complexity || 'O(1)'
    );

    const problemId = result.lastInsertRowid as number;

    // Insert test cases
    if (Array.isArray(testCases) && testCases.length > 0) {
      const insertTc = db.prepare(`
        INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const tc of testCases) {
        insertTc.run(problemId, tc.input, tc.expected_output, tc.is_sample ? 1 : 0, tc.explanation || '');
      }
    }

    res.status(201).json({ success: true, message: 'Problem created successfully.', problemId });
  } catch (error: any) {
    console.error('[Admin] Create problem error:', error);
    res.status(500).json({ success: false, message: 'Failed to create problem.' });
  }
});

// Delete problem
router.delete('/problems/:id', (req: AuthRequest, res: Response): void => {
  try {
    const problemId = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM problems WHERE id = ?').run(problemId);
    res.json({ success: true, message: 'Problem deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete problem.' });
  }
});

export default router;
