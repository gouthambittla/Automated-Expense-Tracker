import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000';
    }

    if (Platform.OS === 'ios' || Platform.OS === 'web') {
        return 'http://localhost:5000';
    }

    // Physical device
    return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
