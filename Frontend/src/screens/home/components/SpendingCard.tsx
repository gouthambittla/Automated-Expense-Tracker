import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Card, ProgressBar, Text } from 'react-native-paper';
import { appColors, lightTheme, shadows } from '../../../theme/GlobalTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface SpendingCardProps {
    title: string;
    spent: number;
    budget: number;
    type?: 'monthly' | 'daily';
    isExceeded?: boolean;
}

const SpendingCard = ({ title, spent, budget, type = 'monthly', isExceeded = false }: SpendingCardProps) => {
    const percentage = budget > 0 ? spent / budget : 0;
    const percentageText = budget > 0 ? Math.round(percentage * 100) : 0;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 1);
    const exceededAmount = spent - budget;

    if (isExceeded && budget > 0) {
        return (
            <View style={[styles.alertCard, { backgroundColor: lightTheme.colors.errorContainer }]} accessibilityRole="alert">
                <View style={styles.alertHeader}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={lightTheme.colors.error} />
                    <Text style={[styles.alertTitle, { color: lightTheme.colors.error }]}>Threshold Exceeded!</Text>
                </View>
                <Text style={[styles.alertMessage, { color: lightTheme.colors.onErrorContainer }]}>
                    You&apos;ve exceeded your {type === 'monthly' ? 'monthly' : 'daily'} spending threshold by ₹{exceededAmount.toLocaleString('en-IN')}. Review your {type === 'monthly' ? 'monthly' : 'daily'} budget!
                </Text>
            </View>
        );
    }

    return (
        <View>
            <Card style={[styles.card, { backgroundColor: lightTheme.colors.surface }, shadows.small]}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.cardTitle, { color: lightTheme.colors.onSurface }]}>
                            {title}
                        </Text>
                        <Text style={[styles.amountText, { color: lightTheme.colors.onSurface }]}>
                            ₹{spent.toLocaleString('en-IN')} {budget ? `/ ₹${budget.toLocaleString('en-IN')}` : ''}
                        </Text>
                    </View>

                    <ProgressBar
                        progress={clampedPercentage}
                        color={appColors.warning}
                        style={[styles.progressBar, { backgroundColor: lightTheme.colors.outline }]}
                    />

                    <Text style={[styles.percentageText, { color: lightTheme.colors.onSurfaceVariant }]}>
                        {percentageText}% of {type === 'monthly' ? 'monthly' : 'daily'} budget used
                    </Text>

                </Card.Content>
            </Card>
        </View>
    )
}

export default SpendingCard

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
    alertCard: {
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 2,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    alertTitle: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 20,
    },
    alertMessage: {
        fontSize: 12,
        lineHeight: 18,
    },
})
