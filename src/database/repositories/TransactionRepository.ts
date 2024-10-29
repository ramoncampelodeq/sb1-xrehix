import db from '../db';
import { Transaction, TransactionFormData, DuesStatus } from '../../types/transaction';

export class TransactionRepository {
  static getAll(): Transaction[] {
    return db.prepare(`
      SELECT * FROM transactions
      ORDER BY date DESC
    `).all();
  }

  static getById(id: number): Transaction | undefined {
    return db.prepare(`
      SELECT * FROM transactions WHERE id = ?
    `).get(id);
  }

  static create(data: TransactionFormData): number {
    const result = db.prepare(`
      INSERT INTO transactions (
        date, type, category, description, amount,
        member_id, receipt_url, status, month, year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.date,
      data.type,
      data.category,
      data.description,
      data.amount,
      data.memberId,
      data.receipt,
      data.status,
      data.month,
      data.year
    );

    return Number(result.lastInsertRowid);
  }

  static update(id: number, data: TransactionFormData): void {
    db.prepare(`
      UPDATE transactions SET
        date = ?,
        type = ?,
        category = ?,
        description = ?,
        amount = ?,
        member_id = ?,
        receipt_url = ?,
        status = ?,
        month = ?,
        year = ?
      WHERE id = ?
    `).run(
      data.date,
      data.type,
      data.category,
      data.description,
      data.amount,
      data.memberId,
      data.receipt,
      data.status,
      data.month,
      data.year,
      id
    );
  }

  static delete(id: number): void {
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  }

  static getBalance(): number {
    const result = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
      FROM transactions
      WHERE status = 'completed'
    `).get();
    
    return result.balance || 0;
  }

  static getMonthlyBalance(month: number, year: number): number {
    const result = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
      FROM transactions
      WHERE status = 'completed'
        AND strftime('%m', date) = ?
        AND strftime('%Y', date) = ?
    `).get(
      String(month + 1).padStart(2, '0'),
      String(year)
    );
    
    return result.balance || 0;
  }

  static getDuesStatus(memberId: number, month: number, year: number): DuesStatus {
    const transaction = db.prepare(`
      SELECT id
      FROM transactions
      WHERE member_id = ?
        AND category = 'dues'
        AND month = ?
        AND year = ?
        AND status = 'completed'
    `).get(memberId, month, year);

    return {
      memberId,
      month,
      year,
      transactionId: transaction?.id,
      status: transaction ? 'paid' : 'pending'
    };
  }
}