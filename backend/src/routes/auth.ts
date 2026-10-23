import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { hashPassword, comparePassword, generateToken, requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res: Response): Promise<void> => {
  try {
    const { full_name, email, username, password, confirmPassword } = req.body;

    if (!full_name || !email || !username || !password) {
      res.status(400).json({ success: false, message: 'All required fields must be provided.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check existing
    const existing = db.prepare('SELECT id, email, username FROM users WHERE email = ? OR username = ?').get(
      normalizedEmail,
      normalizedUsername
    ) as { id: number; email: string; username: string } | undefined;

    if (existing) {
      if (existing.email === normalizedEmail) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        return;
      }
      res.status(409).json({ success: false, message: 'This username is already taken. Please choose another.' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const insert = db.prepare(`
      INSERT INTO users (full_name, email, username, password_hash, role)
      VALUES (?, ?, ?, ?, 'user')
    `);

    const result = insert.run(full_name.trim(), normalizedEmail, normalizedUsername, passwordHash);
    const userId = result.lastInsertRowid as number;

    const user = {
      id: userId,
      username: normalizedUsername,
      email: normalizedEmail,
      full_name: full_name.trim(),
      role: 'user' as const,
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to AlgoVortex.',
      token,
      user,
    });
  } catch (error: any) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Email/username and password are required.' });
      return;
    }

    const norm = identifier.toLowerCase().trim();
    const userRow = db.prepare(`
      SELECT id, username, email, password_hash, full_name, avatar_url, role, bio
      FROM users
      WHERE email = ? OR username = ?
    `).get(norm, norm) as any;

    if (!userRow) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await comparePassword(password, userRow.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const user = {
      id: userRow.id,
      username: userRow.username,
      email: userRow.email,
      full_name: userRow.full_name,
      avatar_url: userRow.avatar_url,
      role: userRow.role,
      bio: userRow.bio,
    };

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Welcome back to AlgoVortex!',
      token,
      user,
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Get current user profile
router.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const userRow = db.prepare(`
      SELECT id, username, email, full_name, avatar_url, role, bio, github_username, created_at
      FROM users WHERE id = ?
    `).get(req.user!.id) as any;

    if (!userRow) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Solved counts
    const solvedCount = db.prepare(`
      SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = 'solved'
    `).get(req.user!.id) as { count: number };

    res.json({
      success: true,
      user: {
        ...userRow,
        solvedProblemsCount: solvedCount.count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update profile
router.post('/update-profile', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { full_name, bio, github_username, avatar_url } = req.body;
    db.prepare(`
      UPDATE users
      SET full_name = COALESCE(?, full_name),
          bio = COALESCE(?, bio),
          github_username = COALESCE(?, github_username),
          avatar_url = COALESCE(?, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(full_name, bio, github_username, avatar_url, req.user!.id);

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
