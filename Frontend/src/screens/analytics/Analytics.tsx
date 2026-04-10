import { CustomHeader } from '@/src/header/CustomHeader'
import CustomCard from '@/src/styleComponents/CustomCard'
import PillSegment from '@/src/styleComponents/PillSegment'
import SpendingBreakdownChart from './components/SpendingBreakdownChart'
import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useExpenses } from '@/src/store/useStore'
import { useTheme } from 'react-native-paper'
import dayjs from 'dayjs'

const getExpenseAmount = (expense: any) => {
    const rawAmount = expense.amount ?? expense.value ?? expense.total ?? 0

    if (typeof rawAmount === 'number') {
        return Number.isFinite(rawAmount) ? rawAmount : 0
    }

    if (typeof rawAmount === 'string') {
        const normalizedAmount = rawAmount.replace(/[^\d.-]/g, '')
        const parsedAmount = Number(normalizedAmount)
        return Number.isFinite(parsedAmount) ? parsedAmount : 0
    }

    return 0
}

const getExpenseDate = (expense: any) => expense.date ?? expense.payment_date ?? expense.created_at ?? expense.updated_at

const Analytics = () => {
    const theme = useTheme()
    const [selectedFilter, setSelectedFilter] = React.useState('Month')
    const allExpenses = useExpenses()

    // Filter expenses based on selected period
    const filteredExpenses = React.useMemo(() => {
        const now = dayjs()
        return allExpenses.filter((expense: any) => {
            const expenseDateValue = getExpenseDate(expense)

            if (!expenseDateValue) {
                return false
            }

            const expenseDate = dayjs(expenseDateValue)

            if (!expenseDate.isValid()) {
                return false
            }

            switch (selectedFilter) {
                case 'Today':
                    return expenseDate.isSame(now, 'day')
                case 'Week':
                    return expenseDate.isSame(now, 'week')
                case 'Month':
                    return expenseDate.isSame(now, 'month')
                default:
                    return true
            }
        })
    }, [allExpenses, selectedFilter])

    // Calculate total spent in filtered period
    const totalSpent = React.useMemo(() => {
        return filteredExpenses.reduce((sum: number, expense: any) => sum + getExpenseAmount(expense), 0)
    }, [filteredExpenses])

    return (
        <ScrollView style={{ flex: 1 }}>
            <CustomHeader>
                <View style={styles.headerContent}>
                    <Text style={[styles.headerText, { color: theme.colors.onPrimary }]}>
                        Analytics
                    </Text>
                    <View style={styles.filterSection}>
                        <PillSegment
                            value={selectedFilter}
                            onChange={setSelectedFilter}
                            options={[
                                { value: 'Today', label: 'Today' },
                                { value: 'Week', label: 'Week' },
                                { value: 'Month', label: 'Month' },
                            ]}
                        />
                    </View>
                </View>
            </CustomHeader>

            <View style={styles.mainContent}>
                <CustomCard>
                    <View>
                        <Text style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}>
                            Total Spent {selectedFilter}
                        </Text>
                        <View style={styles.amountRow}>
                            <Text style={[styles.amount, { color: theme.colors.onSurface }]}>
                                ₹{totalSpent.toLocaleString('en-IN')}
                            </Text>
                            <View style={[styles.percentageBadge, { backgroundColor: theme.colors.error }]}>
                                <Ionicons name="trending-up" size={14} color={theme.colors.onError} />
                                <Text style={[styles.percentageText, { color: theme.colors.onError }]}>
                                    16.6%
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                            More than last period
                        </Text>
                    </View>
                </CustomCard>

                <CustomCard style={styles.breakdownCard}>
                    <Text style={[styles.breakdownTitle, { color: theme.colors.onSurface }]}>
                        Spending Breakdown
                    </Text>
                    <SpendingBreakdownChart expenses={filteredExpenses} />
                </CustomCard>
            </View>
        </ScrollView>
    )
}

export default Analytics

const styles = StyleSheet.create({
    headerContent: {
        width: '100%',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
    },
    filterSection: {
        marginTop: 8,
    },
    mainContent: {
        padding: 16,
        marginBottom: 90,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 12,
    },
    breakdownCard: {
        marginTop: 16,
    },
    breakdownTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    amount: {
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    percentageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
    },
})