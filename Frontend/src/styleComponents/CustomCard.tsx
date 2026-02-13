import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Card, useTheme } from 'react-native-paper'
import { shadows } from '@/src/theme/GlobalTheme'

type Props = {
    children: React.ReactNode
    style?: ViewStyle
    contentStyle?: ViewStyle
}

export default function CustomCard({ children, style, contentStyle }: Props) {
    const theme = useTheme()
    const styles = createStyles(theme)

    return (
        <Card style={[styles.card, shadows.small, style]}>
            <Card.Content style={[styles.cardContent, contentStyle]}>
                {children}
            </Card.Content>
        </Card>
    )
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
        },
        cardContent: {
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
        },
    })
