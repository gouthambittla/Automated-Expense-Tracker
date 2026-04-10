import React, { useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type Transaction = {
    id: string | number;
    amount?: number | string;
    date?: string;
    entryType?: string;
};

type Props = {
    transactions?: Transaction[];
    height?: number;
    loading?: boolean;
    error?: string | null;
};

const CHART_HEIGHT = 212;
const CHART_PADDING = { top: 18, right: 18, bottom: 34, left: 48 };
const Y_AXIS_STEPS = 4;
const DATE_FORMATS = [
    'YYYY-MM-DD',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'YYYY-MM-DDTHH:mm:ssZ',
    'DD-MM-YYYY',
    'DD/MM/YYYY',
    'D MMM YYYY',
    'D MMMM YYYY',
];

const parseTransactionDate = (value?: string) => {
    if (!value) {
        return null;
    }

    const parsed = dayjs(value, DATE_FORMATS, true);
    if (parsed.isValid()) {
        return parsed;
    }

    const fallback = dayjs(value);
    return fallback.isValid() ? fallback : null;
};

const toAmount = (value: number | string | undefined) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const getNiceStep = (maxValue: number) => {
    if (maxValue <= 0) {
        return 1500;
    }

    const roughStep = maxValue / Y_AXIS_STEPS;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const residual = roughStep / magnitude;

    if (residual <= 1) return magnitude;
    if (residual <= 1.5) return 1.5 * magnitude;
    if (residual <= 2) return 2 * magnitude;
    if (residual <= 2.5) return 2.5 * magnitude;
    if (residual <= 5) return 5 * magnitude;
    return 10 * magnitude;
};

const buildMonotonePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    const deltaX: number[] = [];
    const slopes: number[] = [];
    const tangents: number[] = new Array(points.length).fill(0);

    for (let index = 0; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        const dx = next.x - current.x;
        const slope = dx === 0 ? 0 : (next.y - current.y) / dx;
        deltaX.push(dx);
        slopes.push(slope);
    }

    tangents[0] = slopes[0];
    tangents[points.length - 1] = slopes[slopes.length - 1];

    for (let index = 1; index < points.length - 1; index += 1) {
        if (slopes[index - 1] === 0 || slopes[index] === 0 || Math.sign(slopes[index - 1]) !== Math.sign(slopes[index])) {
            tangents[index] = 0;
        } else {
            tangents[index] = (slopes[index - 1] + slopes[index]) / 2;
        }
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
        const current = points[index];
        const next = points[index + 1];
        const dx = deltaX[index] / 3;

        const cp1x = current.x + dx;
        const cp1y = current.y + tangents[index] * dx;
        const cp2x = next.x - dx;
        const cp2y = next.y - tangents[index + 1] * dx;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return path;
};

const WeeklyTrendChart: React.FC<Props> = ({ transactions = [], height = CHART_HEIGHT, loading = false, error = null }) => {
    const theme = useTheme();
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const today = dayjs().startOf('day');
    const weekDays = Array.from({ length: 7 }, (_, index) => today.subtract(6 - index, 'day'));
    const totals = weekDays.map((day) => {
        const dayKey = day.format('YYYY-MM-DD');

        return transactions.reduce((sum, transaction) => {
            const parsedDate = parseTransactionDate(transaction.date);
            if (!parsedDate || parsedDate.format('YYYY-MM-DD') !== dayKey) {
                return sum;
            }

            const normalizedEntryType = String(transaction.entryType || '').toLowerCase();
            if (normalizedEntryType.includes('income')) {
                return sum;
            }

            return sum + Math.max(0, toAmount(transaction.amount));
        }, 0);
    });

    const labels = weekDays.map((day) => day.format('ddd'));
    const highestValue = Math.max(...totals, 0);
    const yStep = getNiceStep(highestValue);
    // ensure yAxisMax is a multiple of yStep and at least as large as highestValue
    const yAxisMax = Math.max(yStep * Y_AXIS_STEPS, Math.ceil(highestValue / yStep) * yStep);
    const chartWidth = Math.max(containerWidth, 0);
    const plotWidth = Math.max(0, chartWidth - CHART_PADDING.left - CHART_PADDING.right);
    const plotHeight = Math.max(1, height - CHART_PADDING.top - CHART_PADDING.bottom);
    const stepX = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth;
    const baselineY = CHART_PADDING.top + plotHeight;

    const points = totals.map((value, index) => {
        const rawRatio = yAxisMax === 0 ? 0 : Math.max(0, Math.min(1, value / yAxisMax));
        const pointY = Math.max(CHART_PADDING.top, CHART_PADDING.top + plotHeight - rawRatio * plotHeight);
        return {
            x: CHART_PADDING.left + stepX * index,
            y: pointY,
            value,
            label: labels[index],
        };
    });

    const linePath = buildMonotonePath(points);
    const areaPath = points.length
        ? `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
        : '';
    const selectedPoint = selectedIndex === null ? null : points[selectedIndex];
    const selectedTooltipWidth = 120;

    const onChartLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const onPressCard = (pressX: number, pressY: number) => {
        const isInsidePlot = pressX >= CHART_PADDING.left
            && pressX <= chartWidth - CHART_PADDING.right
            && pressY >= CHART_PADDING.top
            && pressY <= baselineY;

        if (!isInsidePlot || !points.length) {
            setSelectedIndex(null);
            return;
        }

        if (!points.length) {
            return;
        }

        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        points.forEach((point, index) => {
            const distance = Math.abs(point.x - pressX);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        // threshold: only select if within 50 units of a point, otherwise deselect
        const SELECTION_THRESHOLD = 50;
        if (nearestDistance <= SELECTION_THRESHOLD) {
            setSelectedIndex(nearestIndex);
        } else {
            setSelectedIndex(null);
        }
    };

    const hasTransactions = totals.some((value) => value > 0);
    const footerText = hasTransactions
        ? 'Your spending pattern over the last 7 days'
        : 'No spending recorded in the last 7 days';

    return (
        <Pressable
            onPress={(event) => onPressCard(event.nativeEvent.locationX, event.nativeEvent.locationY)}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: '#EEF2F7' }]}
        >
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Weekly Spending Trend</Text>

            {loading ? (
                <View style={styles.stateContainer}>
                    <ActivityIndicator color={theme.colors.primary} />
                    <Text style={[styles.stateText, { color: theme.colors.onSurfaceVariant }]}>Loading weekly spend...</Text>
                </View>
            ) : error ? (
                <View style={styles.stateContainer}>
                    <Text style={[styles.stateText, { color: theme.colors.error }]}>{error}</Text>
                </View>
            ) : (
                <View style={styles.chartShell} onLayout={onChartLayout}>
                    {chartWidth > 0 ? (
                        <>
                            <Svg width={chartWidth} height={height}>
                                <Defs>
                                    <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="#2E86DE" stopOpacity="0.62" />
                                        <Stop offset="100%" stopColor="#2E86DE" stopOpacity="0.08" />
                                    </LinearGradient>
                                </Defs>

                                {Array.from({ length: Y_AXIS_STEPS + 1 }, (_, index) => {
                                    const y = CHART_PADDING.top + (plotHeight / Y_AXIS_STEPS) * index;
                                    const labelValue = yAxisMax - yStep * index;
                                    return (
                                        <React.Fragment key={`row-${index}`}>
                                            <Line
                                                x1={CHART_PADDING.left}
                                                y1={y}
                                                x2={chartWidth - CHART_PADDING.right}
                                                y2={y}
                                                stroke="#E8EEF5"
                                                strokeWidth={1}
                                                strokeDasharray="3 4"
                                            />
                                            <SvgText
                                                x={CHART_PADDING.left - 6}
                                                y={y + 4}
                                                fill="#6B7280"
                                                fontSize="11"
                                                textAnchor="end"
                                            >
                                                {new Intl.NumberFormat('en-IN').format(Math.max(0, labelValue))}
                                            </SvgText>
                                        </React.Fragment>
                                    );
                                })}

                                {points.map((point, index) => (
                                    <Line
                                        key={`column-${labels[index]}`}
                                        x1={point.x}
                                        y1={CHART_PADDING.top}
                                        x2={point.x}
                                        y2={baselineY}
                                        stroke="#E8EEF5"
                                        strokeWidth={1}
                                        strokeDasharray="3 4"
                                    />
                                ))}

                                <Line
                                    x1={CHART_PADDING.left}
                                    y1={CHART_PADDING.top}
                                    x2={CHART_PADDING.left}
                                    y2={baselineY}
                                    stroke="#94A3B8"
                                    strokeWidth={1.4}
                                />
                                <Line
                                    x1={CHART_PADDING.left}
                                    y1={baselineY}
                                    x2={chartWidth - CHART_PADDING.right}
                                    y2={baselineY}
                                    stroke="#94A3B8"
                                    strokeWidth={1.4}
                                />

                                {areaPath ? <Path d={areaPath} fill="url(#areaFill)" /> : null}
                                {linePath ? <Path d={linePath} fill="none" stroke="#1D78D6" strokeWidth={2.6} /> : null}

                                {selectedPoint ? (
                                    <>
                                        <Line
                                            x1={selectedPoint.x}
                                            y1={CHART_PADDING.top}
                                            x2={selectedPoint.x}
                                            y2={selectedPoint.y}
                                            stroke="#C8D2DD"
                                            strokeWidth={1.2}
                                        />
                                        <Circle cx={selectedPoint.x} cy={selectedPoint.y} r={6} fill="#FFFFFF" stroke="#1D78D6" strokeWidth={2} />
                                        <Circle cx={selectedPoint.x} cy={selectedPoint.y} r={2.4} fill="#1D78D6" />
                                    </>
                                ) : null}

                                {labels.map((label, index) => (
                                    <SvgText
                                        key={`label-${label}-${index}`}
                                        x={points[index]?.x ?? CHART_PADDING.left}
                                        y={height - 10}
                                        fill="#6B7280"
                                        fontSize="11"
                                        textAnchor="middle"
                                    >
                                        {label}
                                    </SvgText>
                                ))}
                            </Svg>

                            {selectedPoint ? (
                                <View
                                    pointerEvents="none"
                                    style={[
                                        styles.tooltip,
                                        {
                                            left: Math.max(12, Math.min(chartWidth - selectedTooltipWidth - 12, selectedPoint.x - selectedTooltipWidth / 2)),
                                            top: Math.max(12, Math.min(height - 50, selectedPoint.y - 78)),
                                            backgroundColor: theme.colors.surface,
                                            borderColor: '#DCE4EE',
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tooltipLabel, { color: theme.colors.onSurface }]}>{selectedPoint.label}</Text>
                                    <Text style={[styles.tooltipValue, { color: theme.colors.primary }]}>
                                        spent : ₹{new Intl.NumberFormat('en-IN').format(Math.round(selectedPoint.value))}
                                    </Text>
                                </View>
                            ) : null}
                        </>
                    ) : null}
                </View>
            )}

            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>{footerText}</Text>
        </Pressable>
    );
};

export default WeeklyTrendChart;

const styles = StyleSheet.create({
    card: {
        marginTop: 12,
        borderRadius: 22,
        paddingHorizontal: 14,
        paddingTop: 16,
        paddingBottom: 18,
        borderWidth: 1,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    chartShell: {
        position: 'relative',
        minHeight: CHART_HEIGHT,
    },
    tooltip: {
        position: 'absolute',
        width: 120,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    tooltipLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
    },
    tooltipValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    footerText: {
        fontSize: 13,
        marginTop: 10,
    },
    stateContainer: {
        minHeight: CHART_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    stateText: {
        fontSize: 14,
        textAlign: 'center',
    },
});
