import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiBaseUrl, apiFetch } from '../services/api';

type AuthContextType = {
    user: User | null;
    serverUser: any | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [serverUser, setServerUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);

        // After successful Firebase sign-in, get ID token and fetch server profile
        const current = result.user;
        const idToken = await current.getIdToken();

        try {
            const res = await apiFetch('/users/me', {
                method: 'GET',
                token: idToken,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to fetch user profile: ${res.status} ${text}`);
            }

            const payload = await res.json();
            console.log('Fetched server user profile:', payload);
            // backend sends { success, message, data }
            setServerUser(payload.data ?? payload);
        } catch (err) {
            console.warn('Could not fetch server user profile', err);
            setServerUser(null);
        }
    };

    const signup = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, serverUser, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
