import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

// Keyword-based category → MaterialCommunityIcons mapping.
const CATEGORY_KEYWORDS: { keywords: string[]; icon: string }[] = [
    { keywords: ['food', 'restaurant', 'dining', 'meal'], icon: 'silverware-fork-knife' },
    { keywords: ['grocery', 'supermarket', 'shop', 'shopping', 'grocer'], icon: 'shopping' },
    { keywords: ['transport', 'taxi', 'uber', 'ola', 'cab', 'train', 'bus', 'auto'], icon: 'taxi' },
    { keywords: ['bill', 'utility', 'subscription', 'netflix', 'spotify', 'phone', 'electricity', 'water'], icon: 'receipt' },
    { keywords: ['entertain', 'movie', 'cinema', 'music', 'games'], icon: 'movie-open' },
    { keywords: ['health', 'pharmacy', 'doctor', 'hospital'], icon: 'pill' },
    { keywords: ['hotel', 'travel', 'airline', 'flight', 'booking'], icon: 'airplane' },
    { keywords: ['paid_to_person', 'person', 'transfer', 'peer', 'friend'], icon: 'account' },
];

export const pickIconName = (category?: string, entryType?: string, merchant?: string) => {
    const normalized = ((merchant || category || entryType) || '').toLowerCase();

    // merchant-aware matches first (exact substrings)
    for (const c of CATEGORY_KEYWORDS) {
        for (const kw of c.keywords) {
            if (normalized.includes(kw)) return c.icon;
        }
    }

    // fallback heuristics
    if (normalized.includes('refund') || normalized.includes('credit')) return 'cash-refund';
    if (normalized.includes('salary') || normalized.includes('income')) return 'bank';

    return 'currency-inr';
};

type Props = {
    category?: string;
    entryType?: string;
    merchant?: string;
    size?: number;
    bgColor?: string | undefined;
    color?: string | undefined;
};

const CategoryIcon: React.FC<Props> = ({ category, entryType, merchant, size = 24, bgColor, color }) => {
    const theme = useTheme();
    const pick = pickIconName(category, entryType, merchant);

    return (
        <View style={[styles.container, { backgroundColor: bgColor ?? theme.colors.surfaceVariant, padding: Math.max(8, size / 2), borderRadius: (size + 16) / 2 }]}>
            <Icon source={pick as any} size={size} color={color ?? theme.colors.onSurface} />
        </View>
    );
};

export default CategoryIcon;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
