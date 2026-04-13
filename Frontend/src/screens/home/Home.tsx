import { CustomHeader } from '@/src/header/CustomHeader';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import SpendingCard from './components/SpendingCard';
import RecentTransactions from './components/RecentTransactions';
import { useAuth } from '@/src/context/AuthContext';
import { getExpensesRequest } from '@/src/services/expenseAPI';
import { useExpenses, useSetExpenses, useGetUser } from '@/src/store/useStore';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import { pickIconName } from '@/src/utils/CategoryIcon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Home = () => {
    const theme = useTheme();
    const user = useGetUser();
    const name = user?.name ?? "";
    const subtitle = 'Track Your Finance Goals';
    const onMenuPress = () => console.log('Menu pressed');
    const { token } = useAuth();

    const transactions = useExpenses();
    const setTransactions = useSetExpenses();
    const [loadingTx, setLoadingTx] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);

    // Compute month and today stats
    const monthStats = React.useMemo(() => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const monthSum = transactions.reduce((acc: number, t: any) => {
            const d = t?.date ? new Date(t.date) : null;
            if (!d || isNaN(d.getTime())) return acc;
            if (d >= monthStart && d < monthEnd) return acc + Number(t.amount || 0);
            return acc;
        }, 0);

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const todaySum = transactions.reduce((acc: number, t: any) => {
            const d = t?.date ? new Date(t.date) : null;
            if (!d || isNaN(d.getTime())) return acc;
            if (d >= todayStart && d < tomorrow) return acc + Number(t.amount || 0);
            return acc;
        }, 0);

        return {
            monthSum,
            todaySum,
            formattedMonth: `₹${monthSum.toLocaleString('en-IN')}`,
        };
    }, [transactions]);

    const monthlyBudget = Number(user?.monthly_budget ?? user?.monthlyBudget ?? 0) || 0;
    const dailyBudget = Number(user?.daily_budget ?? user?.dailyBudget ?? 0) || 0;

    const isMonthlyThresholdExceeded = monthlyBudget > 0 && monthStats.monthSum > monthlyBudget;
    const isDailyThresholdExceeded = dailyBudget > 0 && monthStats.todaySum > dailyBudget;

    useEffect(() => {
        if (!token) return;

        const load = async () => {
            setLoadingTx(true);
            try {
                const data = await getExpensesRequest(token);
                const expenses = data.expenses || [];

                const mapped = expenses.map((e: any, idx: number) => ({
                    id: e.id ?? idx,
                    name: e.title || e.category || e.paid_to || e.payment_for || 'Expense',
                    category: e.category || e.payment_for || '',
                    amount: e.amount ?? e.value ?? 0,
                    date: e.payment_date || e.paymentDate || e.created_at,
                    icon: pickIconName(e.category, e.entry_type),
                    entryType: e.entry_type,
                    iconBgColor: theme.colors.tertiaryContainer,
                }));

                // dedupe by id to avoid duplicates
                const byId = new Map<string, any>();
                for (const m of mapped) {
                    byId.set(String(m.id), m);
                }

                setTransactions(Array.from(byId.values()));
            } catch (err: any) {
                setTxError(err?.message || 'Failed to load expenses');
            } finally {
                setLoadingTx(false);
            }
        };

        load();
    }, [token, theme, setTransactions]);

    return (
        <ScrollView style={{ flex: 1 }}>
            <CustomHeader>
                <View style={styles.topRow}>
                    <View style={styles.titleBlock}>
                        <Text style={[styles.titleText, { color: theme.colors.onPrimary }]}>
                            Hi, {name}!
                        </Text>

                        <Text
                            style={[styles.subtitleText, { color: theme.colors.onPrimary }]}
                        >
                            {subtitle}
                        </Text>
                    </View>

                    <IconButton
                        icon="dots-vertical"
                        iconColor={theme.colors.onPrimary}
                        size={22}
                        onPress={onMenuPress}
                    />
                </View>
                <View style={styles.balanceSection}>
                    <Text style={[styles.balanceLabel, { color: theme.colors.onPrimary }]}>
                        Amount spent
                    </Text>
                    <Text style={[styles.amountText, { color: theme.colors.onPrimary }]}>
                        {monthStats.formattedMonth}
                    </Text>
                </View>
            </CustomHeader>
            <View style={styles.mainContent}>
                {/* Threshold exceeded banner */}
                {isMonthlyThresholdExceeded && (
                    <View style={[styles.banner, { backgroundColor: theme.colors.errorContainer }]} accessibilityRole="alert">
                        <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} style={{ marginTop: 2 }} />
                        <View style={styles.bannerContent}>
                            <Text style={[styles.bannerTitle, { color: theme.colors.error }]}>Limit Exceeded!</Text>
                            <Text style={[styles.bannerMessage, { color: theme.colors.onErrorContainer }]}>
                                You&apos;ve exceeded your monthly spending limit by ₹{(monthStats.monthSum - monthlyBudget).toLocaleString('en-IN')}. Review your budget!
                            </Text>
                        </View>
                    </View>
                )}

                {/* Daily Spending Card */}
                <View style={{ marginBottom: 12 }}>
                    <SpendingCard
                        title="Daily Spending"
                        spent={monthStats.todaySum}
                        budget={dailyBudget}
                        type="daily"
                        isExceeded={isDailyThresholdExceeded}
                    />
                </View>

                {/* Monthly Spending Card */}
                <SpendingCard
                    title="Monthly Spending"
                    spent={monthStats.monthSum}
                    budget={monthlyBudget}
                    type="monthly"
                    isExceeded={isMonthlyThresholdExceeded}
                />
                <WeeklyTrendChart
                    transactions={transactions}
                    loading={loadingTx}
                    error={txError}
                />
                <RecentTransactions transactions={transactions} />
            </View>
        </ScrollView>
    );
}

export default Home

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        marginRight: 14,
    },

    titleBlock: {
        flex: 1,
    },

    titleText: {
        fontWeight: '700',
        fontSize: 16,
    },

    subtitleText: {
        marginTop: 4,
        opacity: 0.85,
        fontSize: 12,
    },

    balanceSection: {
        marginTop: 34,
    },

    balanceLabel: {
        opacity: 0.9,
        fontSize: 14,
    },

    amountText: {
        marginTop: 10,
        fontSize: 44,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    remainingText: {
        marginTop: 8,
        opacity: 0.9,
        fontSize: 14,
    },

    mainContent: {
        padding: 16,
        marginBottom: 90,
        gap: 8,
    },

    banner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 16,
    },

    bannerContent: {
        flex: 1,
        gap: 4,
    },

    bannerTitle: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 20,
    },

    bannerMessage: {
        fontSize: 12,
        lineHeight: 18,
    },
});