import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import CustomCard from '@/src/styleComponents/CustomCard'
import CategoryIcon from '@/src/utils/CategoryIcon'
import { formatDayDateMonth } from '@/src/utils/dateUtils'

type Transaction = {
    id: string | number;
    name?: string;
    category?: string;
    amount?: number;
    date?: string;
    icon?: string;
    entryType?: string;
    iconBgColor?: string;
};

const RecentTransactions = ({ transactions }: { transactions?: Transaction[] }) => {
    const theme = useTheme()
    const styles = createStyles(theme)

    const list = transactions || []

    const navigation = useNavigation();

    const onViewAll = () => {
        navigation.navigate('Transcations' as never);
    };

    return (
        <>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Recent Transactions</Text>
                <TouchableOpacity onPress={onViewAll} accessibilityRole="button">
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            <View>
                <CustomCard>
                    {list.length === 0 ? (
                        <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', paddingVertical: 20 }}>
                            No transactions yet.
                        </Text>
                    ) : null}
                    {list.map((tx) => (
                        <View key={String(tx.id)} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <CategoryIcon category={tx.category} entryType={tx.entryType} merchant={tx.name} size={24} bgColor={tx.iconBgColor} />

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
                                        {formatDayDateMonth(tx.date)}
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