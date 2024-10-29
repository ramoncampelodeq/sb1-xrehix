import db from '../db';
import { Member, MemberFormData } from '../../types/member';

export class MemberRepository {
  static getAll(): Member[] {
    return db.prepare(`
      SELECT * FROM members
      ORDER BY name ASC
    `).all();
  }

  static getById(id: number): Member | undefined {
    return db.prepare(`
      SELECT * FROM members WHERE id = ?
    `).get(id);
  }

  static create(data: MemberFormData): number {
    const result = db.prepare(`
      INSERT INTO members (
        name, cpf, profession, degree, birthday,
        email, phone, join_date, high_degrees
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.cpf,
      data.profession,
      data.degree,
      data.birthday,
      data.email,
      data.phone,
      data.joinDate,
      JSON.stringify(data.highDegrees)
    );

    if (data.relatives?.length) {
      const insertRelative = db.prepare(`
        INSERT INTO member_relatives (member_id, name, birthday, relationship)
        VALUES (?, ?, ?, ?)
      `);

      for (const relative of data.relatives) {
        insertRelative.run(result.lastInsertRowid, relative.name, relative.birthday, relative.relationship);
      }
    }

    return Number(result.lastInsertRowid);
  }

  static update(id: number, data: MemberFormData): void {
    db.prepare(`
      UPDATE members SET
        name = ?,
        cpf = ?,
        profession = ?,
        degree = ?,
        birthday = ?,
        email = ?,
        phone = ?,
        join_date = ?,
        high_degrees = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name,
      data.cpf,
      data.profession,
      data.degree,
      data.birthday,
      data.email,
      data.phone,
      data.joinDate,
      JSON.stringify(data.highDegrees),
      id
    );

    // Update relatives
    if (data.relatives) {
      // Remove existing relatives
      db.prepare('DELETE FROM member_relatives WHERE member_id = ?').run(id);

      // Add new relatives
      const insertRelative = db.prepare(`
        INSERT INTO member_relatives (member_id, name, birthday, relationship)
        VALUES (?, ?, ?, ?)
      `);

      for (const relative of data.relatives) {
        insertRelative.run(id, relative.name, relative.birthday, relative.relationship);
      }
    }
  }

  static delete(id: number): void {
    db.prepare('DELETE FROM members WHERE id = ?').run(id);
  }
}