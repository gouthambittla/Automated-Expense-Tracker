import createRootStore from './createStore';
import { createExpenseSlice } from './slices/expenseSlice';
import { createUserSlice } from './slices/userSlice';

const useStore = createRootStore(createExpenseSlice, createUserSlice);

export default useStore;

export const useExpenses = () => useStore((s: any) => s.expenses);
export const useSetExpenses = () => useStore((s: any) => s.setExpenses);
export const useAddExpense = () => useStore((s: any) => s.addExpense);
export const useClearExpenses = () => useStore((s: any) => s.clearExpenses);
export const useGetUser = () => useStore((s: any) => s.user);
export const useSetUser = () => useStore((s: any) => s.setUser);