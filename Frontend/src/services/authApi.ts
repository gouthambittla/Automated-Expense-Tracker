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
    const contentType = response.headers.get('content-type') || '';

    // try to parse JSON when possible, fall back to text for HTML/error pages
    let data: any = null;
    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        // attempt to read text (could be HTML error page)
        const text = await response.text();
        // try parse JSON anyway in case server mis-set content-type
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { __raw: text };
        }
    }

    if (!response.ok) {
        const message = data?.message || data?.error || data?.__raw || 'Request failed';
        throw new Error(message);
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

export const getUserInfoRequest = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await handleResponse(response);
    return data;
};

export const updateUserBudgetRequest = async (token: string, payload: { monthlyBudget?: number | null; dailyBudget?: number | null }) => {
    const response = await fetch(`${API_BASE_URL}/api/user/budget`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    return data;
};