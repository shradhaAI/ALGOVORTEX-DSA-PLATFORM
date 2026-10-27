import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { hashPassword, comparePassword, generateToken, requireAuth, AuthRequest } from '../middleware/auth.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const router = Router();

// Google Sign-In
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ success: false, message: 'Google credential token is required.' });
      return;
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      res.status(500).json({
        success: false,
        message: 'Google Sign-In is not configured on the backend. Please configure GOOGLE_CLIENT_ID in your environment.',
      });
      return;
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ success: false, message: 'Invalid Google token payload.' });
      return;
    }

    if (!payload.email_verified) {
      res.status(400).json({ success: false, message: 'Google email address is not verified.' });
      return;
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const fullName = payload.name || payload.given_name || email.split('@')[0];
    const avatarUrl = payload.picture || '';

    // Check existing by google_id
    let userRow = db.prepare(`
      SELECT id, username, email, full_name, avatar_url, role, bio
      FROM users
      WHERE google_id = ?
    `).get(googleId) as any;

    if (!userRow) {
      // Check existing by email
      userRow = db.prepare(`
        SELECT id, username, email, full_name, avatar_url, role, bio
        FROM users
        WHERE email = ?
      `).get(email) as any;

      if (userRow) {
        // Link google_id and update avatar if empty
        db.prepare(`
          UPDATE users
          SET google_id = ?,
              avatar_url = CASE WHEN (avatar_url IS NULL OR avatar_url = '') THEN ? ELSE avatar_url END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(googleId, avatarUrl, userRow.id);
        userRow.avatar_url = userRow.avatar_url || avatarUrl;
      } else {
        // Create new user
        let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (baseUsername.length < 3) baseUsername = 'user_' + baseUsername;
        let finalUsername = baseUsername;
        let counter = 1;
        while (db.prepare('SELECT id FROM users WHERE username = ?').get(finalUsername)) {
          finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
          counter++;
          if (counter > 10) break;
        }

        const dummyHash = await hashPassword(crypto.randomBytes(32).toString('hex'));

        const insert = db.prepare(`
          INSERT INTO users (full_name, email, username, password_hash, role, avatar_url, google_id)
          VALUES (?, ?, ?, ?, 'user', ?, ?)
        `);
        const result = insert.run(fullName, email, finalUsername, dummyHash, avatarUrl, googleId);
        const userId = result.lastInsertRowid as number;

        userRow = {
          id: userId,
          username: finalUsername,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'user',
          bio: '',
        };
      }
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
      message: 'Google Sign-In successful! Welcome to AlgoVortex.',
      token,
      user,
    });
  } catch (error: any) {
    console.error('[Auth] Google login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired Google authentication credential.',
    });
  }
});

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
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
router.post('/login', async (req: Request, res: Response): Promise<void> => {
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

// ── Forgot Password ──────────────────────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always respond with success to prevent email enumeration attacks
    const userRow = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail) as { id: number } | undefined;

    if (userRow) {
      // Generate a secure, time-limited token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Store token in DB (upsert by email)
      db.prepare(`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET token = excluded.token, expires_at = excluded.expires_at, used = 0
      `).run(userRow.id, token, expiresAt);

      // Log the reset link (email delivery requires SMTP config)
      const resetLink = `http://localhost:5173/reset-password?token=${token}`;
      console.log(`[Auth] Password reset token for ${normalizedEmail}: ${resetLink}`);
      console.log('[Auth] Configure SMTP in .env to send this via email automatically.');
    }

    // Always return 200 to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('[Auth] Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── Reset Password ───────────────────────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Token and new password are required.' });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
      return;
    }

    const tokenRow = db.prepare(`
      SELECT prt.user_id, prt.expires_at, prt.used
      FROM password_reset_tokens prt
      WHERE prt.token = ?
    `).get(token) as { user_id: number; expires_at: string; used: number } | undefined;

    if (!tokenRow) {
      res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
      return;
    }
    if (tokenRow.used === 1) {
      res.status(400).json({ success: false, message: 'This reset link has already been used.' });
      return;
    }
    if (new Date(tokenRow.expires_at) < new Date()) {
      res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
      return;
    }

    const newHash = await hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, tokenRow.user_id);
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE token = ?').run(token);

    res.json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (error: any) {
    console.error('[Auth] Reset password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
