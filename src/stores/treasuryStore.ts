import { create } from 'zustand';
import { Transaction, TransactionFormData, DuesStatus } from '../types/transaction';

interface TreasuryState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: TransactionFormData) => void;
  updateTransaction: (id: number, transaction: TransactionFormData) => void;
  deleteTransaction: (id: number) => void;
  getBalance: () => number;
  getMonthlyBalance: (month: number, year: number) => number;
  getDuesStatus: (memberId: number, month: number, year: number) => DuesStatus;
  getMemberDuesHistory: (memberId: number, year: number) => DuesStatus[];
  recordDuesPayment: (memberId: number, month: number, year: number) => void;
}

export const MONTHLY_DUES_AMOUNT = 140;

export const useTreasuryStore = create<TreasuryState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  addTransaction: (transactionData) => {
    const transactions = get().transactions;
    const newTransaction = {
      ...transactionData,
      id: Math.max(0, ...transactions.map(t => t.id)) + 1
    };
    set({ transactions: [...transactions, newTransaction] });
  },

  updateTransaction: (id, transactionData) => {
    const transactions = get().transactions;
    set({
      transactions: transactions.map(transaction =>
        transaction.id === id ? { ...transactionData, id } : transaction
      )
    });
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions;
    set({ transactions: transactions.filter(transaction => transaction.id !== id) });
  },

  getBalance: () => {
    const transactions = get().transactions;
    return transactions.reduce((acc, curr) => {
      const amount = curr.amount;
      return curr.type === 'income' ? acc + amount : acc - amount;
    }, 0);
  },

  getMonthlyBalance: (month, year) => {
    const transactions = get().transactions;
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((acc, curr) => {
        const amount = curr.amount;
        return curr.type === 'income' ? acc + amount : acc - amount;
      }, 0);
  },

  getDuesStatus: (memberId, month, year) => {
    const transactions = get().transactions;
    const duesTransaction = transactions.find(t => 
      t.memberId === memberId &&
      t.category === 'dues' &&
      t.month === month &&
      t.year === year &&
      t.status === 'completed'
    );

    const today = new Date();
    const isPastDue = new Date(year, month) < new Date(today.getFullYear(), today.getMonth());

    return {
      memberId,
      year,
      month,
      transactionId: duesTransaction?.id,
      status: duesTransaction ? 'paid' : (isPastDue ? 'late' : 'pending')
    };
  },

  getMemberDuesHistory: (memberId, year) => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return months.map(month => get().getDuesStatus(memberId, month, year));
  },

  recordDuesPayment: (memberId, month, year) => {
    const transaction: TransactionFormData = {
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category: 'dues',
      description: `Mensalidade - ${month + 1}/${year}`,
      amount: MONTHLY_DUES_AMOUNT,
      memberId,
      status: 'completed',
      month,
      year
    };
    get().addTransaction(transaction);
  }
}));