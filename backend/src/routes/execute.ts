import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { executeCode, TestCase } from '../services/codeRunner.js';

const router = Router();

// Run Code (Sample test cases only)
router.post('/run', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      res.status(400).json({ success: false, message: 'problemId, language, and code are required.' });
      return;
    }

    // Fetch sample test cases
    const testCases = db.prepare(`
      SELECT id, input, expected_output, is_sample, explanation
      FROM test_cases
      WHERE problem_id = ? AND is_sample = 1
    `).all(problemId) as TestCase[];

    if (testCases.length === 0) {
      res.status(404).json({ success: false, message: 'No sample test cases configured for this problem.' });
      return;
    }

    const executionResult = await executeCode(language, code, testCases, false);

    res.json({
      success: true,
      result: executionResult,
    });
  } catch (error: any) {
    console.error('[Execute] Run error:', error);
    res.status(500).json({ success: false, message: 'Execution service error.' });
  }
});

// Submit Solution (All test cases + persistent database record)
router.post('/submit', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user!.id;

    if (!problemId || !language || !code) {
      res.status(400).json({ success: false, message: 'problemId, language, and code are required.' });
      return;
    }

    // Fetch all test cases (sample + hidden)
    const allTestCases = db.prepare(`
      SELECT id, input, expected_output, is_sample, explanation
      FROM test_cases
      WHERE problem_id = ?
      ORDER BY is_sample DESC, id ASC
    `).all(problemId) as TestCase[];

    if (allTestCases.length === 0) {
      res.status(404).json({ success: false, message: 'No test cases available for evaluation.' });
      return;
    }

    const result = await executeCode(language, code, allTestCases, true);

    // Record submission in database
    const insertSub = db.prepare(`
      INSERT INTO submissions (
        user_id, problem_id, code, language, verdict,
        execution_time_ms, memory_kb, test_cases_passed, total_test_cases, output_log
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const subRes = insertSub.run(
      userId,
      problemId,
      code,
      language,
      result.verdict,
      result.executionTimeMs,
      result.memoryKb,
      result.passedCount,
      allTestCases.length,
      result.outputLog || null
    );

    const submissionId = subRes.lastInsertRowid as number;

    // Update Problem statistics
    db.prepare(`
      UPDATE problems
      SET total_submissions = total_submissions + 1,
          total_accepted = total_accepted + CASE WHEN ? = 'Accepted' THEN 1 ELSE 0 END,
          acceptance_rate = ROUND(CAST(total_accepted + CASE WHEN ? = 'Accepted' THEN 1 ELSE 0 END AS REAL) * 100.0 / (total_submissions + 1), 1)
      WHERE id = ?
    `).run(result.verdict, result.verdict, problemId);

    // Update User Progress
    if (result.verdict === 'Accepted') {
      db.prepare(`
        INSERT INTO user_progress (user_id, problem_id, status, last_submitted_at)
        VALUES (?, ?, 'solved', CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, problem_id) DO UPDATE SET
          status = 'solved',
          last_submitted_at = CURRENT_TIMESTAMP
      `).run(userId, problemId);
    } else {
      // Record attempted if not already solved
      db.prepare(`
        INSERT INTO user_progress (user_id, problem_id, status, last_submitted_at)
        VALUES (?, ?, 'attempted', CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, problem_id) DO UPDATE SET
          last_submitted_at = CURRENT_TIMESTAMP
        WHERE status != 'solved'
      `).run(userId, problemId);
    }

    res.json({
      success: true,
      submissionId,
      result,
    });
  } catch (error: any) {
    console.error('[Execute] Submit error:', error);
    res.status(500).json({ success: false, message: 'Execution or submission evaluation failed.' });
  }
});

export default router;
