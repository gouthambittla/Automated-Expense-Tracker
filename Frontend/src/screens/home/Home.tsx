import { CustomHeader } from '@/src/header/CustomHeader';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import MonthlySpending from './components/MonthlySpending';
import RecentTransactions from './components/RecentTransactions';
import { useAuth } from '@/src/context/AuthContext';
import { getExpensesRequest } from '@/src/services/expenseAPI';
import { useExpenses, useSetExpenses, useGetUser } from '@/src/store/useStore';

const Home = () => {
    const theme = useTheme();
    const user = useGetUser();
    const name = user?.name ?? "";
    const subtitle = 'Track Your Finance Goals';
    const totalBalance = '$ 43,520';
    const remainingBalance = '$1,200';
    const onMenuPress = () => console.log('Menu pressed');
    const { token } = useAuth();

    const transactions = useExpenses();
    const setTransactions = useSetExpenses();
    const [loadingTx, setLoadingTx] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const formatDate = (d: string | null | undefined) => {
            if (!d) return '';
            const dt = new Date(d);
            try {
                return dt.toLocaleString(undefined, { month: 'short', day: 'numeric' });
            } catch {
                return d;
            }
        };

        const pickIconForCategory = (category?: string, entryType?: string) => {
            const cat = (category || entryType || '').toLowerCase();
            if (cat.includes('food')) return 'silverware-fork-knife';
            if (cat.includes('entertain')) return 'movie-open';
            if (cat.includes('shop') || cat.includes('grocery')) return 'shopping-outline';
            if (cat.includes('bill')) return 'receipt-outline';
            if (cat.includes('paid_to_person') || cat.includes('person')) return 'account';
            return 'currency-inr';
        };

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
                    date: formatDate(e.payment_date || e.paymentDate || e.created_at),
                    icon: pickIconForCategory(e.category, e.entry_type),
                    iconBgColor: theme.colors.tertiaryContainer,
                }));

                setTransactions(mapped);
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
                    <Avatar.Image
                        size={48}
                        source={{ uri: 'https://i.pravatar.cc/100?img=25' }}
                        style={styles.avatar}
                    />

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
                        Total Balance
                    </Text>
                    <Text style={[styles.amountText, { color: theme.colors.onPrimary }]}>
                        {totalBalance}
                    </Text>
                    <Text style={[styles.remainingText, { color: theme.colors.onPrimary }]}>
                        Remaining Balance: {remainingBalance}
                    </Text>
                </View>
            </CustomHeader>
            <View style={styles.mainContent}>
                <MonthlySpending />
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