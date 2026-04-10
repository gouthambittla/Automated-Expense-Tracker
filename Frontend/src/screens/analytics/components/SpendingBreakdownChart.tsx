import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg'
import { lightTheme, shadows } from '@/src/theme/GlobalTheme'

interface Expense {
    id: string | number
    category: string
    amount: number
    [key: string]: any
}

interface CategoryBreakdown {
    category: string
    amount: number
    percentage: number
    color: string
    startAngle: number
    endAngle: number
    midAngle: number
}

const CATEGORY_COLORS: Record<string, string> = {
    Food: '#FF6B6B',
    Transport: '#4A90E2',
    Shopping: '#50C878',
    Bills: '#FFA500',
    Entertainment: '#52B0E8',
    Other: '#9B9B9B',
}

interface SpendingBreakdownChartProps {
    expenses: Expense[]
}

const SEGMENT_GAP_RADIANS = 0.05
const POP_OUT_DISTANCE = 8
const TOOLTIP_WIDTH = 128
const TOOLTIP_HEIGHT = 52

const getExpenseAmount = (expense: Expense) => {
    const rawAmount: unknown = expense.amount ?? expense.value ?? expense.total ?? 0

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

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
})

const describeArcSegment = (
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
) => {
    const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
    const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
    const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle)
    const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ')
}

const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({ expenses }) => {
    const { width } = useWindowDimensions()
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const categoryBreakdown = useMemo<CategoryBreakdown[]>(() => {
        const grouped = expenses.reduce(
            (acc, expense) => {
                const category = expense.category || 'Other'
                const amount = getExpenseAmount(expense)

                if (!Number.isFinite(amount) || amount <= 0) return acc

                acc[category] = (acc[category] || 0) + amount
                return acc
            },
            {} as Record<string, number>
        )

        const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0)
        let currentAngle = -Math.PI / 2

        return Object.entries(grouped)
            .sort(([, leftAmount], [, rightAmount]) => rightAmount - leftAmount)
            .map(([category, amount]) => {
                const sweepAngle = total > 0 ? (amount / total) * Math.PI * 2 : 0
                const adjustedStartAngle = currentAngle + SEGMENT_GAP_RADIANS / 2
                const adjustedEndAngle = currentAngle + sweepAngle - SEGMENT_GAP_RADIANS / 2
                const midAngle = currentAngle + sweepAngle / 2

                currentAngle += sweepAngle

                return {
                    category,
                    amount,
                    percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
                    color: CATEGORY_COLORS[category] || '#9B9B9B',
                    startAngle: adjustedStartAngle,
                    endAngle: adjustedEndAngle,
                    midAngle,
                }
            })
    }, [expenses])

    useEffect(() => {
        if (selectedIndex !== null && !categoryBreakdown[selectedIndex]) {
            setSelectedIndex(null)
        }
    }, [categoryBreakdown, selectedIndex])

    const selectedCategory = selectedIndex !== null ? categoryBreakdown[selectedIndex] : null

    if (categoryBreakdown.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses data available</Text>
            </View>
        )
    }

    const handleTap = (index: number) => {
        setSelectedIndex((currentIndex) => (currentIndex === index ? null : index))
    }

    const chartSize = Math.min(Math.max(width - 112, 236), 200)
    const chartHeight = Math.round(chartSize * 0.95)
    const center = chartSize / 2
    const outerRadius = Math.floor(chartSize * 0.43)
    const innerRadius = Math.floor(outerRadius * 0.6)
    const tooltipPosition = selectedCategory
        ? (() => {
            const anchorPoint = polarToCartesian(center, center, outerRadius + 30, selectedCategory.midAngle)

            const left = Math.min(
                Math.max(anchorPoint.x - TOOLTIP_WIDTH / 2, 0),
                chartSize - TOOLTIP_WIDTH
            )
            const top = Math.min(
                Math.max(anchorPoint.y - TOOLTIP_HEIGHT / 2, 0),
                chartHeight - TOOLTIP_HEIGHT
            )

            return { left, top }
        })()
        : null

    return (
        <View style={styles.container}>
            <View style={styles.chartWrapper}>
                <View style={[styles.chartFrame, { width: chartSize, height: chartHeight }]}>
                    <Svg width={chartSize} height={chartHeight}>
                        {categoryBreakdown.map((item, index) => {
                            const isSelected = selectedIndex === index
                            const translation = isSelected
                                ? polarToCartesian(0, 0, POP_OUT_DISTANCE, item.midAngle)
                                : { x: 0, y: 0 }

                            return (
                                <G
                                    key={item.category}
                                    x={translation.x}
                                    y={translation.y}
                                >
                                    <Path
                                        d={describeArcSegment(center, center, innerRadius, outerRadius, item.startAngle, item.endAngle)}
                                        fill={item.color}
                                        onPress={() => handleTap(index)}
                                    />
                                </G>
                            )
                        })}
                        <Circle cx={center} cy={center} r={innerRadius - 4} fill={lightTheme.colors.surface} />
                    </Svg>

                    {selectedCategory && tooltipPosition ? (
                        <View
                            pointerEvents="none"
                            style={[
                                styles.tooltip,
                                {
                                    left: tooltipPosition.left,
                                    top: tooltipPosition.top,
                                },
                            ]}
                        >
                            <Text style={styles.tooltipText}>
                                {selectedCategory.category} : ₹{selectedCategory.amount.toLocaleString('en-IN')}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            <View style={styles.legendContainer}>
                {categoryBreakdown.map((item, index) => (
                    <Pressable
                        key={item.category}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.category} ₹${item.amount.toLocaleString('en-IN')}`}
                        style={[
                            styles.legendItem,
                            selectedIndex === index ? styles.legendItemActive : null,
                        ]}
                        onPress={() => handleTap(index)}
                        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
                    >
                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                        <Text style={styles.categoryName}>{item.category}</Text>
                        <View style={styles.amountColumn}>
                            <Text style={styles.amountText}>₹{item.amount.toLocaleString('en-IN')}</Text>
                            <Text style={styles.percentageText}>{item.percentage}%</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        paddingTop: 4,
        paddingBottom: 0,
    },
    chartWrapper: {
        alignItems: 'center',
        marginBottom: 12,
    },
    chartFrame: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    emptyContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: lightTheme.colors.onSurfaceVariant,
    },
    legendContainer: {
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    legendItemActive: {
        backgroundColor: lightTheme.colors.surfaceVariant,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    categoryName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: lightTheme.colors.onSurface,
    },
    amountColumn: {
        alignItems: 'flex-end',
        gap: 2,
    },
    amountText: {
        fontSize: 13,
        fontWeight: '600',
        color: lightTheme.colors.onSurface,
    },
    percentageText: {
        fontSize: 12,
        fontWeight: '400',
        color: lightTheme.colors.onSurfaceVariant,
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: lightTheme.colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: lightTheme.colors.outline,
        minWidth: TOOLTIP_WIDTH,
        minHeight: TOOLTIP_HEIGHT,
        justifyContent: 'center',
        ...shadows.small,
    },
    tooltipText: {
        fontSize: 15,
        fontWeight: '500',
        color: lightTheme.colors.onSurface,
        textAlign: 'center',
    },
})

export default SpendingBreakdownChart
