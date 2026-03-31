import { create } from 'zustand';

export type Slice<T> = (set: any, get: any, api?: any) => T;

export const createRootStore = <T extends object>(...slices: Slice<any>[]) => {
    const combined = (set: any, get: any, api: any) => Object.assign({}, ...slices.map((s) => s(set, get, api)));
    return create<T>(combined as any);
};

export default createRootStore;
