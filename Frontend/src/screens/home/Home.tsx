import { CustomHeader } from '@/src/header/CustomHeader';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import MonthlySpending from './components/MonthlySpending';
import RecentTransactions from './components/RecentTransactions';
import { useAuth } from '@/src/context/AuthContext';
import { getExpensesRequest } from '@/src/services/expenseAPI';
import { useExpenses, useSetExpenses, useGetUser } from '@/src/store/useStore';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import { pickIconName } from '@/src/utils/CategoryIcon';

const Home = () => {
    const theme = useTheme();
    const user = useGetUser();
    const name = user?.name ?? "";
    const subtitle = 'Track Your Finance Goals';
    const totalBalance = '$ 43,520';
    const onMenuPress = () => console.log('Menu pressed');
    const { token } = useAuth();

    const transactions = useExpenses();
    console.log('Home transactions from store:', transactions);
    const setTransactions = useSetExpenses();
    const [loadingTx, setLoadingTx] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // icon selection delegated to CategoryIcon.pickIconName

        const load = async () => {
            setLoadingTx(true);
            console.log('Loading expenses with token:', token);
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
                console.log('Failed to load expenses', err);
                setTxError(err?.message || 'Failed to load expenses');
            } finally {
                setLoadingTx(false);
            }
        };

        load();
    }, [token, theme]);

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
                        {totalBalance}
                    </Text>
                </View>
            </CustomHeader>
            <View style={styles.mainContent}>
                <MonthlySpending />
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
    },
});