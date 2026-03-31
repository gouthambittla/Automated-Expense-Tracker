import { API_BASE_URL } from '../config/api';

export type CreateExpensePayload = {
    entryType: string;
    sourceType?: string;
    amount: number;
    currency?: string;
    title?: string | null;
    category?: string | null;
    paidTo?: string | null;
    paymentFor?: string | null;
    paymentMethod?: string | null;
    paymentDate: string;
    notes?: string | null;
    paymentProofUrl?: string | null;
    sourceText?: string | null;
    aiConfidence?: number | null;
    aiRawJson?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    isUserVerified?: boolean;
};
console.log(API_BASE_URL);
export const createExpenseRequest = async (
    token: string,
    payload: CreateExpensePayload
) => {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || 'Failed to create expense');
    }

    return data;
};

export const getExpensesRequest = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch expenses');
    }

    return data;
};