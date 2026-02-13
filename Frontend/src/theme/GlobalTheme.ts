import { Platform, StyleSheet } from 'react-native';
import {
    configureFonts,
    MD3DarkTheme,
    MD3LightTheme,
    MD3Theme,
} from 'react-native-paper';

const palette = {
    primary: '#1D78D6',
    primaryContainer: '#2F8DF0',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFFFFF',

    // Accents
    secondary: '#3B82F6',
    secondaryContainer: '#E8F2FF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#0B1B2B',

    tertiary: '#10B981',
    tertiaryContainer: '#DFF7EF',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#052016',

    // Neutrals
    background: '#F6F8FC',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF3FA',
    outline: '#D7E0EC',
    onBackground: '#0B1220',
    onSurface: '#0B1220',
    onSurfaceVariant: '#55657A',
    error: '#EF4444',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#450A0A',

    success: '#10B981',
    warning: '#F59E0B',

    // Additional Colors
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Brand Accents
    info: '#0EA5E9',
    infoContainer: '#E0F2FE',

    // Semantic Colors
    disabled: '#D1D5DB',
};

const fontConfig = {
    fontFamily: Platform.select({
        ios: 'System',
        android: 'sans-serif',
        default: 'System',
    }),
};

const fonts = configureFonts({ config: fontConfig });

export const shadows = {
    small: {
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    medium: {
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    large: {
        elevation: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
};

export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
    roundness: 18,
    fonts,

    colors: {
        ...MD3LightTheme.colors,

        // Core
        primary: palette.primary,
        onPrimary: palette.onPrimary,
        primaryContainer: palette.primaryContainer,
        onPrimaryContainer: palette.onPrimaryContainer,

        secondary: palette.secondary,
        onSecondary: palette.onSecondary,
        secondaryContainer: palette.secondaryContainer,
        onSecondaryContainer: palette.onSecondaryContainer,

        tertiary: palette.tertiary,
        onTertiary: palette.onTertiary,
        tertiaryContainer: palette.tertiaryContainer,
        onTertiaryContainer: palette.onTertiaryContainer,

        background: palette.background,
        onBackground: palette.onBackground,
        surface: palette.surface,
        onSurface: palette.onSurface,
        surfaceVariant: palette.surfaceVariant,
        onSurfaceVariant: palette.onSurfaceVariant,
        outline: palette.outline,

        error: palette.error,
        onError: palette.onError,
        errorContainer: palette.errorContainer,
        onErrorContainer: palette.onErrorContainer,
    },
};

//
// 🌙 DARK THEME (same vibe, darker surfaces)
//
export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
    roundness: 18,
    fonts,

    colors: {
        ...MD3DarkTheme.colors,
        primary: '#4AA3FF',
        onPrimary: '#001A33',
        primaryContainer: '#0C3A70',
        onPrimaryContainer: '#EAF4FF',

        secondary: '#66B2FF',
        onSecondary: '#001A33',
        secondaryContainer: '#0B2B4A',
        onSecondaryContainer: '#D7EDFF',

        tertiary: '#34D399',
        onTertiary: '#022016',
        tertiaryContainer: '#064E3B',
        onTertiaryContainer: '#DFF7EF',

        background: '#0B1220',
        onBackground: '#EAF0FF',
        surface: '#111B2D',
        onSurface: '#EAF0FF',
        surfaceVariant: '#16233A',
        onSurfaceVariant: '#B8C4D8',
        outline: '#2A3B58',

        error: '#F87171',
        onError: '#2B0000',
        errorContainer: '#5F1111',
        onErrorContainer: '#FFD6D6',
    },
};

export const appColors = {
    success: palette.success,
    warning: palette.warning,
    info: palette.info,
    gray: {
        50: palette.gray50,
        100: palette.gray100,
        200: palette.gray200,
        300: palette.gray300,
        400: palette.gray400,
        500: palette.gray500,
        600: palette.gray600,
        700: palette.gray700,
        800: palette.gray800,
        900: palette.gray900,
    },
    disabled: palette.disabled,
};