import type { StateCreator } from 'zustand';
import type { Expense } from '@/types';
import { mockExpenses } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

export interface ExpensesSlice {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

export const createExpensesSlice: StateCreator<ExpensesSlice> = (set) => ({
  expenses: mockExpenses,
  addExpense: (expense) =>
    set((state) => ({ expenses: [{ ...expense, id: generateId() }, ...state.expenses] })),
  updateExpense: (id, data) =>
    set((state) => ({ expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
  deleteExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
});
