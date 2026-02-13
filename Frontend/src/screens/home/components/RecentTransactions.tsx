import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icon, useTheme } from 'react-native-paper'
import { lightTheme } from '@/src/theme/GlobalTheme'
import CustomCard from '@/src/styleComponents/CustomCard'
import { dummyTransactions } from '@/src/services/constants'

const RecentTransactions = () => {
    const theme = useTheme()
    const styles = createStyles(theme)

    return (
        <>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Recent Transactions</Text>
                <Text style={styles.viewAll}>View All</Text>
            </View>
            <View>
                <CustomCard>
                    {dummyTransactions.map((tx) => (
                        <View key={tx.id} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View style={[styles.iconContainer, { backgroundColor: tx.iconBgColor }]}>
                                    <Icon source={tx.icon} size={24} />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                        {tx.name}
                                    </Text>
                                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                        {tx.category}
                                    </Text>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                        ₹{tx.amount}
                                    </Text>
                                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                        {tx.date}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </CustomCard>
            </View>
        </>
    )
}

export default RecentTransactions

const createStyles = (theme: any) => StyleSheet.create({
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 26,
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    iconContainer: { padding: 15, borderRadius: 28 },
})