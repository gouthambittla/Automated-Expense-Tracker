import React from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import { lightTheme } from '@/src/theme/GlobalTheme'

export type PillOption<T = string> = {
    value: T
    label: string
}

type Props<T = string> = {
    value: T
    options: PillOption<T>[]
    onChange: (next: T) => void

    // Optional customizations
    containerStyle?: ViewStyle
    pillStyle?: ViewStyle
    selectedPillStyle?: ViewStyle
    unselectedPillStyle?: ViewStyle
    labelStyle?: TextStyle
    selectedLabelStyle?: TextStyle
    unselectedLabelStyle?: TextStyle
}

export default function PillSegment<T extends string | number>({
    value,
    options,
    onChange,
    containerStyle,
    pillStyle,
    selectedPillStyle,
    unselectedPillStyle,
    labelStyle,
    selectedLabelStyle,
    unselectedLabelStyle,
}: Props<T>) {
    const styles = createStyles()

    return (
        <View style={[styles.row, containerStyle]}>
            {options.map((opt) => {
                const selected = opt.value === value
                return (
                    <Pressable
                        key={String(opt.value)}
                        onPress={() => onChange(opt.value)}
                        style={[
                            styles.pill,
                            pillStyle,
                            selected ? styles.pillSelected : styles.pillUnselected,
                            selected ? selectedPillStyle : unselectedPillStyle,
                        ]}
                    >
                        <Text
                            style={[
                                styles.label,
                                labelStyle,
                                selected ? styles.labelSelected : styles.labelUnselected,
                                selected ? selectedLabelStyle : unselectedLabelStyle,
                            ]}
                        >
                            {opt.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

const createStyles = () =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },

        pill: {
            paddingHorizontal: 18,
            height: 38,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
        },

        pillSelected: {
            backgroundColor: lightTheme.colors.primary,
            borderWidth: 0,
        },

        pillUnselected: {
            backgroundColor: lightTheme.colors.surface,
            borderWidth: 1,
            borderColor: lightTheme.colors.outline,
        },

        label: {
            fontSize: 13,
            fontWeight: '600',
        },

        labelSelected: {
            color: lightTheme.colors.onPrimary,
        },

        labelUnselected: {
            color: lightTheme.colors.onSurface,
        },
    })
