import { Slice } from '../createStore';


type ExpenseSlice = {
    expenses: any[];
    setExpenses: (items: any[]) => void;
    addExpense: (item: any) => void;
    clearExpenses: () => void;
};

export const createExpenseSlice: Slice<ExpenseSlice> = (set, get) => ({
    expenses: [],
    setExpenses: (items: any[]) => set({ expenses: items }),
    addExpense: (item: any) => set((state: any) => ({ expenses: [item, ...state.expenses] })),
    clearExpenses: () => set({ expenses: [] }),
});

export default createExpenseSlice;
