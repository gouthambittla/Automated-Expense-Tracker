import { Platform } from 'react-native';

const defaultApiBaseUrl =
    Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || defaultApiBaseUrl;

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
    token?: string;
    headers?: HeadersInit;
};

export const apiFetch = async (path: string, options: ApiRequestOptions = {}) => {
    const { token, headers, ...restOptions } = options;

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...restOptions,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers ?? {}),
        },
    });

    return response;
};
