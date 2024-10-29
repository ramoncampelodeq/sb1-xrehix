export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 
  | 'dues' 
  | 'donation' 
  | 'event' 
  | 'maintenance' 
  | 'utility' 
  | 'charity' 
  | 'other';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  memberId?: number;
  receipt?: string;
  status: 'pending' | 'completed' | 'cancelled';
  month?: number;
  year?: number;
}

export interface TransactionFormData extends Omit<Transaction, 'id'> {}

export interface DuesStatus {
  memberId: number;
  year: number;
  month: number;
  transactionId?: number;
  status: 'paid' | 'pending' | 'late';
}