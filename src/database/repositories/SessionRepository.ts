import db from '../db';
import { Session, SessionFormData } from '../../types/session';

export class SessionRepository {
  static getAll(): Session[] {
    return db.prepare(`
      SELECT 
        s.*,
        GROUP_CONCAT(sa.member_id) as attendees
      FROM sessions s
      LEFT JOIN session_attendance sa ON s.id = sa.session_id
      GROUP BY s.id
      ORDER BY s.date DESC, s.time DESC
    `).all().map(row => ({
      ...row,
      attendees: row.attendees ? row.attendees.split(',').map(Number) : []
    }));
  }

  static getById(id: number): Session | undefined {
    const session = db.prepare(`
      SELECT 
        s.*,
        GROUP_CONCAT(sa.member_id) as attendees
      FROM sessions s
      LEFT JOIN session_attendance sa ON s.id = sa.session_id
      WHERE s.id = ?
      GROUP BY s.id
    `).get(id);

    if (session) {
      session.attendees = session.attendees ? session.attendees.split(',').map(Number) : [];
    }

    return session;
  }

  static create(data: SessionFormData): number {
    const result = db.prepare(`
      INSERT INTO sessions (date, time, degree, agenda, minutes_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      data.date,
      data.time,
      data.degree,
      data.agenda,
      data.minutesUrl
    );

    return Number(result.lastInsertRowid);
  }

  static update(id: number, data: SessionFormData): void {
    db.prepare(`
      UPDATE sessions SET
        date = ?,
        time = ?,
        degree = ?,
        agenda = ?,
        minutes_url = ?
      WHERE id = ?
    `).run(
      data.date,
      data.time,
      data.degree,
      data.agenda,
      data.minutesUrl,
      id
    );
  }

  static delete(id: number): void {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
  }

  static addAttendee(sessionId: number, memberId: number): void {
    db.prepare(`
      INSERT OR IGNORE INTO session_attendance (session_id, member_id)
      VALUES (?, ?)
    `).run(sessionId, memberId);
  }

  static removeAttendee(sessionId: number, memberId: number): void {
    db.prepare(`
      DELETE FROM session_attendance
      WHERE session_id = ? AND member_id = ?
    `).run(sessionId, memberId);
  }
}