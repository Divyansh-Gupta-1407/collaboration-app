import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  async register(email: string, name: string, password: string) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = uuidv4();

    const result = await pool.query(
      `INSERT INTO users (id, email, name, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, avatar_url, created_at, updated_at`,
      [id, email, name, passwordHash]
    );

    return result.rows[0];
  }

  async login(email: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as string | number
    } as jwt.SignOptions);

    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getUserById(id: string) {
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async getUsersByIds(ids: string[]) {
    if (!ids.length) return [];
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, created_at, updated_at FROM users WHERE id = ANY($1)',
      [ids]
    );
    return result.rows;
  }

  async updateProfile(id: string, name: string, avatarUrl: string) {
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($2, name), avatar_url = COALESCE($3, avatar_url), updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, avatar_url, created_at, updated_at`,
      [id, name, avatarUrl]
    );
    return result.rows[0];
  }

  async searchUsers(query: string) {
    const result = await pool.query(
      `SELECT id, email, name, avatar_url, created_at, updated_at
       FROM users
       WHERE name ILIKE $1 OR email ILIKE $1
       LIMIT 50`,
      [`%${query}%`]
    );
    return result.rows;
  }
}

export const userService = new UserService();
