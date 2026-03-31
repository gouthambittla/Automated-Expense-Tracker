import { API_BASE_URL } from '../config/api';

type LoginPayload = {
    email: string;
    password: string;
};

type SignupPayload = {
    name: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
    }

    return data;
};

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

export const signupRequest = async (payload: SignupPayload): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};