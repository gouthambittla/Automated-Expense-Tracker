import { Slice } from '../createStore';

export type UiUser = {
    id?: number | string;
    name?: string | null;
    email?: string | null;
};

type UserSlice = {
    user: UiUser | null;
    setUser: (u: UiUser | null) => void;
    clearUser: () => void;
};

export const createUserSlice: Slice<UserSlice> = (set, get) => ({
    user: null,
    setUser: (u: UiUser | null) => set({ user: u }),
    clearUser: () => set({ user: null }),
});

export default createUserSlice;
