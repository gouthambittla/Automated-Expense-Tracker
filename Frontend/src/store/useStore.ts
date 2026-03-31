import createRootStore from './createStore';
import { createExpenseSlice } from './slices/expenseSlice';

const useStore = createRootStore(createExpenseSlice);

export default useStore;

export const useExpenses = () => useStore((s: any) => s.expenses);
export const useSetExpenses = () => useStore((s: any) => s.setExpenses);
export const useAddExpense = () => useStore((s: any) => s.addExpense);
