import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDatabasePath(): string {
  if (process.env.SQLITE_PATH) {
    const customDir = path.dirname(process.env.SQLITE_PATH);
    try {
      if (!fs.existsSync(customDir)) {
        fs.mkdirSync(customDir, { recursive: true });
      }
    } catch {
      // If custom path fails, fall through
    }
    return process.env.SQLITE_PATH;
  }

  let baseDir = process.env.DATA_DIR;
  if (!baseDir) {
    if (process.env.VERCEL) {
      baseDir = path.join(os.tmpdir(), 'algovortex_data');
    } else {
      baseDir = path.resolve(__dirname, '../../data');
    }
  }

  try {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    // Verify write permissions
    const testFile = path.join(baseDir, '.write_test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
  } catch {
    // Fallback to os.tmpdir() in read-only serverless filesystems
    baseDir = path.join(os.tmpdir(), 'algovortex_data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
  }

  return path.join(baseDir, 'algovortex.db');
}

const dbPath = getDatabasePath();
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
try {
  db.pragma('journal_mode = WAL');
} catch (e) {
  // In-memory or specific filesystems might not support WAL
}
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      bio TEXT DEFAULT '',
      github_username TEXT DEFAULT '',
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
      topic_slug TEXT NOT NULL,
      description TEXT NOT NULL,
      input_format TEXT,
      output_format TEXT,
      constraints TEXT,
      examples_json TEXT NOT NULL,
      hints_json TEXT NOT NULL,
      starter_code_json TEXT NOT NULL,
      editorial_markdown TEXT,
      time_complexity TEXT,
      space_complexity TEXT,
      acceptance_rate REAL DEFAULT 70.0,
      total_submissions INTEGER DEFAULT 0,
      total_accepted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS test_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
      input TEXT NOT NULL,
      expected_output TEXT NOT NULL,
      is_sample INTEGER DEFAULT 0,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      verdict TEXT NOT NULL,
      execution_time_ms INTEGER DEFAULT 0,
      memory_kb INTEGER DEFAULT 0,
      test_cases_passed INTEGER DEFAULT 0,
      total_test_cases INTEGER DEFAULT 0,
      output_log TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, problem_id)
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK(status IN ('solved', 'attempted')),
      last_submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, problem_id)
    );

    CREATE TABLE IF NOT EXISTS roadmaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      level TEXT NOT NULL,
      total_steps INTEGER DEFAULT 0,
      estimated_hours INTEGER DEFAULT 0,
      items_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      status TEXT NOT NULL,
      problems_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
    CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic_slug);
    CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens(token);
  `);

  // Migrations for existing databases
  try {
    db.exec(`ALTER TABLE users ADD COLUMN google_id TEXT;`);
  } catch {
    // Column already exists
  }

  try {
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);`);
  } catch {
    // Index already exists
  }

  console.log('[Database] SQLite initialized successfully at:', dbPath);
}
