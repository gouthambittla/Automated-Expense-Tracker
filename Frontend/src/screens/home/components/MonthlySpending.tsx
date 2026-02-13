import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Card, ProgressBar, Text } from 'react-native-paper';
import { appColors, lightTheme, shadows } from '../../../theme/GlobalTheme';

const MonthlySpending = () => {
    const spent = 25650;
    const budget = 30000;
    const percentage = spent / budget;
    const percentageText = Math.round(percentage * 100);

    return (
        <View>
            <Card style={[styles.card, { backgroundColor: lightTheme.colors.surface }, shadows.small]}>
                <Card.Content style={styles.cardContent}>
                    {/* Title and Amount Row */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.cardTitle, { color: lightTheme.colors.onSurface }]}>
                            Monthly Spending
                        </Text>
                        <Text style={[styles.amountText, { color: lightTheme.colors.onSurface }]}>
                            ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <ProgressBar
                        progress={percentage}
                        color={appColors.warning}
                        style={[styles.progressBar, { backgroundColor: lightTheme.colors.outline }]}
                    />

                    {/* Percentage Text */}
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