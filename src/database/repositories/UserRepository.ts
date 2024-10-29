import db from '../db';
import { verify } from '../../utils/crypto';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export class UserRepository {
  static async authenticate(username: string, password: string): Promise<User | null> {
    const user = db.prepare(`
      SELECT id, username, password, role
      FROM users
      WHERE username = ?
    `).get(username);

    if (!user) return null;

    const isValid = await verify(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static logActivity(userId: number, action: string, description: string): void {
    db.prepare(`
      INSERT INTO activity_log (user_id, action, description)
      VALUES (?, ?, ?)
    `).run(userId, action, description);
  }

  static getActivityLog(userId: number, limit: number = 10): any[] {
    return db.prepare(`
      SELECT * FROM activity_log
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(userId, limit);
  }
}