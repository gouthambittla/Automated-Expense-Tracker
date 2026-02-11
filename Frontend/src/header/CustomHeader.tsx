import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
    Surface,
    useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    children?: React.ReactNode;
};

export const CustomHeader: React.FC<Props> = ({
    children,
}) => {
    const theme = useTheme();

    return (
        <Surface
            style={[
                styles.container,
                { backgroundColor: theme.colors.primary },
            ]}
            elevation={0}
        >
            <SafeAreaView>
                {children}
            </SafeAreaView>
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 32,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        marginRight: 14,
    },

    titleBlock: {
        flex: 1,
    },

    titleText: {
        fontWeight: '700',
    },

    subtitleText: {
        marginTop: 4,
        opacity: 0.85,
    },

    balanceSection: {
        marginTop: 34,
    },

    balanceLabel: {
        opacity: 0.9,
    },

    amountText: {
        marginTop: 10,
        fontSize: 44,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    remainingText: {
        marginTop: 8,
        opacity: 0.9,
    },
});
