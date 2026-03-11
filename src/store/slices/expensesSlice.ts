/**
 * Expenses Store Slice - شريحة إدارة المصروفات
 */
import { Expense } from '@/types';
import { mockExpenses } from '@/data/mock-data';
import { generateId } from '@/lib/id';

export interface ExpensesState {
    expenses: Expense[];
    loading: boolean;
    error: string | null;
}

export const initialExpensesState: ExpensesState = {
    expenses: mockExpenses,
    loading: false,
    error: null,
};

export interface ExpensesActions {
    addExpense: (expense: Omit<Expense, 'id'>) => string;
    updateExpense: (id: string, data: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setExpenses: (expenses: Expense[]) => void;
    clearExpenses: () => void;
}

export const createExpensesSlice = (set: any) => ({
    ...initialExpensesState,
    addExpense: (expense: Omit<Expense, 'id'>) => {
        const id = generateId();
        set((state: ExpensesState) => ({
            expenses: [{ ...expense, id }, ...state.expenses],
        }));
        return id;
    },
    updateExpense: (id: string, data: Partial<Expense>) => {
        set((state: ExpensesState) => ({
            expenses: state.expenses.map((expense) =>
                expense.id === id ? { ...expense, ...data } : expense
            ),
        }));
    },
    deleteExpense: (id: string) => {
        set((state: ExpensesState) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
    },
    setLoading: (loading: boolean) => {
        set({ loading });
    },
    setError: (error: string | null) => {
        set({ error });
    },
    setExpenses: (expenses: Expense[]) => {
        set({ expenses });
    },
    clearExpenses: () => {
        set({ expenses: [] });
    },
});

export type ExpensesStore = ExpensesState & ExpensesActions;
