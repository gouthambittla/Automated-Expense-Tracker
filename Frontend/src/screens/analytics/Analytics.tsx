import { CustomHeader } from '@/src/header/CustomHeader'
import CustomCard from '@/src/styleComponents/CustomCard'
import PillSegment from '@/src/styleComponents/PillSegment'
import { lightTheme } from '@/src/theme/GlobalTheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Analytics = () => {
    const [selectedFilter, setSelectedFilter] = React.useState('Today')

    return (
        <View>
            <CustomHeader>
                <View>
                    <Text style={styles.headerText}>Analytics</Text>
                    <PillSegment value={selectedFilter}
                        onChange={setSelectedFilter}
                        options={[
                            { value: 'Today', label: 'Today' },
                            { value: 'Week', label: 'Week' },
                            { value: 'Month', label: 'Month' },
                        ]} />
                </View>
            </CustomHeader>
            <View style={styles.content}>
                <CustomCard>
                    <View>
                        <Text style={styles.cardTitle}>Total Spent This Month</Text>
                        <View style={styles.amountRow}>
                            <Text style={styles.amount}>₹25,650</Text>
                            <View style={styles.percentageBadge}>
                                <Ionicons name="trending-up" size={14} color={lightTheme.colors.onError} />
                                <Text style={styles.percentageText}>16.6%</Text>
                            </View>
                        </View>
                        <Text style={styles.subtitle}>More than last month</Text>
                    </View>
                </CustomCard>
            </View>
        </View>
    )
}

export default Analytics

const styles = StyleSheet.create({
    headerText: {
        fontSize: 28,
        fontWeight: '700',
        color: lightTheme.colors.onPrimary,
        marginBottom: 16,
    },
    content: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '400',
        color: lightTheme.colors.onSurfaceVariant,
        marginBottom: 12,
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
        color: lightTheme.colors.onSurface,
        letterSpacing: -0.5,
    },
    percentageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: lightTheme.colors.error,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '600',
        color: lightTheme.colors.onError,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: lightTheme.colors.onSurfaceVariant,
    },
})