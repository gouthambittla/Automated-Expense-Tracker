import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import { Card, ProgressBar, Text } from 'react-native-paper';
import { appColors, lightTheme, shadows } from '../../../theme/GlobalTheme';
import { useExpenses, useGetUser } from '@/src/store/useStore';

const MonthlySpending = () => {
    const transactions = useExpenses();
    const user = useGetUser();

    const { spent, budget, percentage, percentageText } = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const monthSpent = transactions.reduce((acc: number, tx: any) => {
            const d = tx?.date ? new Date(tx.date) : null;
            if (!d || isNaN(d.getTime())) return acc;
            if (d >= start && d < end) return acc + Number(tx.amount || 0);
            return acc;
        }, 0);

        const userBudget = Number(user?.monthly_budget ?? user?.monthlyBudget ?? 0) || 0;
        const pct = userBudget > 0 ? monthSpent / userBudget : 0;

        return {
            spent: monthSpent,
            budget: userBudget,
            percentage: Math.min(Math.max(pct, 0), 1),
            percentageText: userBudget > 0 ? Math.round(pct * 100) : 0,
        };
    }, [transactions, user]);

    return (
        <View>
            <Card style={[styles.card, { backgroundColor: lightTheme.colors.surface }, shadows.small]}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.cardTitle, { color: lightTheme.colors.onSurface }]}>
                            Monthly Spending
                        </Text>
                        <Text style={[styles.amountText, { color: lightTheme.colors.onSurface }]}>
                            ₹{spent.toLocaleString('en-IN')} {budget ? `/ ₹${budget.toLocaleString('en-IN')}` : ''}
                        </Text>
                    </View>

                    <ProgressBar
                        progress={percentage}
                        color={appColors.warning}
                        style={[styles.progressBar, { backgroundColor: lightTheme.colors.outline }]}
                    />

                    <Text style={[styles.percentageText, { color: lightTheme.colors.onSurfaceVariant }]}>
                        {percentageText}% of monthly budget used
                    </Text>

                </Card.Content>
            </Card>
        </View>
    )
}

export default MonthlySpending

const styles = StyleSheet.create({
    card: {
        marginBottom: 2,
        borderRadius: 12,
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 24,
    },
    amountText: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    progressBar: {
        height: 12,
        borderRadius: 6,
    },
    percentageText: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
    },
})