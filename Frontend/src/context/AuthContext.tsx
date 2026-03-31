import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, signupRequest } from '../services/authApi';

type User = {
    id?: number;
    name?: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadAuth = async () => {
            try {
                const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
                const savedUser = await AsyncStorage.getItem(USER_KEY);

                if (savedToken) {
                    setToken(savedToken);
                }

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.log('Failed to load auth data', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginRequest({ email, password });

        const loggedInUser = data.user || { email };

        setToken(data.token);
        setUser(loggedInUser);

        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    };

    const signup = async (name: string, email: string, password: string) => {
        const data = await signupRequest({ name, email, password });

        const signedUpUser = data.user || { name, email };

        setToken(data.token);
        setUser(signedUpUser);

        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(signedUpUser));
    };

    const logout = async () => {
        setToken(null);
        setUser(null);

        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            signup,
            logout,
        }),
        [user, token, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};