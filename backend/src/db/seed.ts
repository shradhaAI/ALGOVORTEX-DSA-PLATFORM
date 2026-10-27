import { db, initDatabase } from './database.js';
import { hashPassword } from '../middleware/auth.js';
import { CORE_TOPICS, CURATED_PROBLEMS } from './curatedProblems.js';

export async function seedDatabase() {
  initDatabase();

  console.log('[Seed] Seeding database with initial users, topics, problems, and roadmaps...');

  // 1. Seed Users (Admin & Demo Student)
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (existingUsers.count === 0) {
    const adminPass = await hashPassword('AlgoAdmin@2026');
    const demoPass = await hashPassword('GrindEra@2026');

    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, avatar_url, role, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'admin',
      'admin@algovortex.com',
      adminPass,
      'AlgoVortex Architect',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'admin',
      'Lead Architect & System Engineer at AlgoVortex.'
    );

    insertUser.run(
      'algovortex_coder',
      'demo@algovortex.com',
      demoPass,
      'Alex Vance',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      'user',
      'Grinding LeetCode and preparing for Tier-1 FAANG interviews.'
    );

    console.log('[Seed] Default users created: admin@algovortex.com and demo@algovortex.com');
  }

  // 2. Seed & Upsert Core Topics
  const upsertTopic = db.prepare(`
    INSERT INTO topics (slug, name, icon, description, order_index)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      icon = excluded.icon,
      description = excluded.description,
      order_index = excluded.order_index
  `);

  for (const t of CORE_TOPICS) {
    upsertTopic.run(t.slug, t.name, t.icon, t.description, t.order_index);
  }
  console.log(`[Seed] ${CORE_TOPICS.length} topics seeded/upserted.`);

  // 3. Seed & Upsert Curated Problems and Test Cases
  const upsertProblem = db.prepare(`
    INSERT INTO problems (
      title, slug, difficulty, topic_slug, description,
      input_format, output_format, constraints,
      examples_json, hints_json, starter_code_json, editorial_markdown,
      time_complexity, space_complexity, acceptance_rate, total_submissions, total_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      difficulty = excluded.difficulty,
      topic_slug = excluded.topic_slug,
      description = excluded.description,
      input_format = excluded.input_format,
      output_format = excluded.output_format,
      constraints = excluded.constraints,
      examples_json = excluded.examples_json,
      hints_json = excluded.hints_json,
      starter_code_json = excluded.starter_code_json,
      editorial_markdown = excluded.editorial_markdown,
      time_complexity = excluded.time_complexity,
      space_complexity = excluded.space_complexity
  `);

  const insertTestCase = db.prepare(`
    INSERT INTO test_cases (problem_id, input, expected_output, is_sample, explanation)
    VALUES (?, ?, ?, ?, ?)
  `);

  const deleteTestCases = db.prepare(`
    DELETE FROM test_cases WHERE problem_id = ?
  `);

  let seededCount = 0;
  for (const p of CURATED_PROBLEMS) {
    upsertProblem.run(
      p.title,
      p.slug,
      p.difficulty,
      p.topic_slug,
      p.description,
      p.input_format,
      p.output_format,
      p.constraints,
      JSON.stringify(p.examples),
      JSON.stringify(p.hints),
      JSON.stringify(p.starterCode || {}),
      p.editorial,
      p.time_complexity,
      p.space_complexity,
      p.acceptance_rate,
      p.submissions,
      p.accepted
    );

    const problemRow = db.prepare('SELECT id FROM problems WHERE slug = ?').get(p.slug) as { id: number };
    if (problemRow && problemRow.id) {
      deleteTestCases.run(problemRow.id);
      for (const st of p.sampleTests) {
        insertTestCase.run(problemRow.id, st.input, st.expected, st.isSample, st.explanation || 'Sample test case');
      }
      for (const ht of p.hiddenTests) {
        insertTestCase.run(problemRow.id, ht.input, ht.expected, ht.isSample, ht.explanation || 'Hidden test case');
      }
    }
    seededCount++;
  }
  console.log(`[Seed] ${seededCount} curated problems & test cases upserted across 9 categories.`);

  // 4. Seed Roadmaps (if none exist)
  const existingRoadmaps = db.prepare('SELECT COUNT(*) as count FROM roadmaps').get() as { count: number };
  if (existingRoadmaps.count === 0) {
    const insertRoadmap = db.prepare(`
      INSERT INTO roadmaps (slug, title, description, difficulty, estimated_hours, total_steps, steps_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertRoadmap.run(
      'beginner-0-to-1',
      'Beginner: 0 to 1 DSA Mastery',
      'Complete beginner roadmap from basic array manipulation and strings up to recursive backtracking and simple dynamic programming.',
      'Beginner',
      45,
      60,
      JSON.stringify([
        { step: 1, title: 'Array Traversal & Two Pointers', topic: 'arrays', problemSlug: 'two-sum', status: 'available' },
        { step: 2, title: 'Hash Map Lookup & Frequency Counting', topic: 'hashing', problemSlug: 'contains-duplicate', status: 'available' },
        { step: 3, title: 'String Inversion & Palindrome Invariants', topic: 'strings', problemSlug: 'valid-palindrome', status: 'available' },
        { step: 4, title: 'LIFO Stack Bracket Validation', topic: 'stack', problemSlug: 'valid-parentheses', status: 'available' },
        { step: 5, title: 'Binary Search Monotonicity', topic: 'searching', problemSlug: 'binary-search', status: 'available' },
        { step: 6, title: 'Container With Most Water', topic: 'two-pointers', problemSlug: 'container-with-most-water', status: 'available' },
        { step: 7, title: 'Divide & Conquer Sorting', topic: 'sorting', problemSlug: 'merge-sort', status: 'available' },
        { step: 8, title: 'Recursion Fundamentals', topic: 'recursion', problemSlug: 'fibonacci-number', status: 'available' },
      ])
    );

    insertRoadmap.run(
      'sde-sheet-75',
      'AlgoVortex Blind 75 / SDE Sheet',
      'The definitive curated list of the most frequently asked DSA problems at Google, Amazon, Microsoft, and Meta.',
      'Intermediate',
      75,
      90,
      JSON.stringify([
        { step: 1, title: 'Two Sum', topic: 'arrays', problemSlug: 'two-sum' },
        { step: 2, title: 'Valid Anagram', topic: 'strings', problemSlug: 'valid-anagram' },
        { step: 3, title: 'Valid Parentheses', topic: 'stack', problemSlug: 'valid-parentheses' },
        { step: 4, title: 'Binary Search', topic: 'searching', problemSlug: 'binary-search' },
        { step: 5, title: 'Container With Most Water', topic: 'two-pointers', problemSlug: 'container-with-most-water' },
        { step: 6, title: 'Best Time to Buy and Sell Stock', topic: 'arrays', problemSlug: 'best-time-to-buy-and-sell-stock' },
        { step: 7, title: 'Product of Array Except Self', topic: 'arrays', problemSlug: 'product-of-array-except-self' },
        { step: 8, title: 'Sort Colors', topic: 'sorting', problemSlug: 'sort-colors' },
      ])
    );

    insertRoadmap.run(
      'advanced-graph-dp',
      'Advanced Graphs, Trees & Dynamic Programming',
      'Deep dive into Topological Sort, Dijkstra, Segment Trees, Trie prefix trees, and multi-dimensional Dynamic Programming.',
      'Advanced',
      30,
      60,
      JSON.stringify([
        { step: 1, title: 'Two Pointers Trapping Rain Water', topic: 'two-pointers', problemSlug: 'trapping-rain-water' },
        { step: 2, title: 'Sliding Window Maximum', topic: 'queue', problemSlug: 'sliding-window-maximum' },
        { step: 3, title: 'Longest Consecutive Sequence', topic: 'hashing', problemSlug: 'longest-consecutive-sequence' },
        { step: 4, title: 'Daily Temperatures Monotonic Stack', topic: 'stack', problemSlug: 'daily-temperatures' },
        { step: 5, title: 'Quick Sort Partitioning', topic: 'sorting', problemSlug: 'quick-sort' },
      ])
    );

    console.log('[Seed] 3 Curated Roadmaps seeded.');
  }

  // 5. Seed Contests (if none exist)
  const existingContests = db.prepare('SELECT COUNT(*) as count FROM contests').get() as { count: number };
  if (existingContests.count === 0) {
    const insertContest = db.prepare(`
      INSERT INTO contests (slug, title, description, start_time, end_time, status, problems_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertContest.run(
      'vortex-weekly-42',
      'Vortex Weekly Challenge #42',
      '90-minute live competitive coding arena featuring 4 problems ranging from Easy to Hard. Real-time ranking with penalty time.',
      new Date(Date.now() + 86400000 * 2).toISOString(),
      new Date(Date.now() + 86400000 * 2 + 5400000).toISOString(),
      'upcoming',
      JSON.stringify(['two-sum', 'valid-parentheses', 'container-with-most-water', 'sort-colors'])
    );

    insertContest.run(
      'grinding-era-biweekly-10',
      'Grinding Era Grand Prix #10',
      'High-stakes algorithmic contest designed for senior engineers and competitive coders worldwide.',
      new Date(Date.now() - 86400000 * 5).toISOString(),
      new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
      'ended',
      JSON.stringify(['binary-search', 'container-with-most-water', 'trapping-rain-water'])
    );

    console.log('[Seed] Sample Contests seeded.');
  }

  console.log('[Seed] Database initialization and seed completed!');
}
