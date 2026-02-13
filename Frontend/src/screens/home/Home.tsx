import { CustomHeader } from '@/src/header/CustomHeader';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import MonthlySpending from './components/MonthlySpending';
import RecentTransactions from './components/RecentTransactions';

const Home = () => {
    const theme = useTheme();
    const name = 'prawns pulao ';
    const subtitle = 'Track Your Finance Goals';
    const totalBalance = '$ 43,520';
    const remainingBalance = '$1,200';
    const onMenuPress = () => console.log('Menu pressed');

    return (
        <ScrollView style={{ flex: 1 }}>
            <CustomHeader>
                <View style={styles.topRow}>
                    <Avatar.Image
                        size={48}
                        source={{ uri: 'https://i.pravatar.cc/100?img=25' }}
                        style={styles.avatar}
                    />

                    <View style={styles.titleBlock}>
                        <Text style={[styles.titleText, { color: theme.colors.onPrimary }]}>
                            Hi, {name}!
                        </Text>

                        <Text
                            style={[styles.subtitleText, { color: theme.colors.onPrimary }]}
                        >
                            {subtitle}
                        </Text>
                    </View>

                    <IconButton
                        icon="dots-vertical"
                        iconColor={theme.colors.onPrimary}
                        size={22}
                        onPress={onMenuPress}
                    />
                </View>
                <View style={styles.balanceSection}>
                    <Text style={[styles.balanceLabel, { color: theme.colors.onPrimary }]}>
                        Total Balance
                    </Text>
                    <Text style={[styles.amountText, { color: theme.colors.onPrimary }]}>
                        {totalBalance}
                    </Text>
                    <Text style={[styles.remainingText, { color: theme.colors.onPrimary }]}>
                        Remaining Balance: {remainingBalance}
                    </Text>
                </View>
            </CustomHeader>
            <View style={styles.mainContent}>
                <MonthlySpending />
                <RecentTransactions />
            </View>
        </ScrollView>
    );
}

export default Home

const styles = StyleSheet.create({
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
        fontSize: 16,
    },

    subtitleText: {
        marginTop: 4,
        opacity: 0.85,
        fontSize: 12,
    },

    balanceSection: {
        marginTop: 34,
    },

    balanceLabel: {
        opacity: 0.9,
        fontSize: 14,
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
        fontSize: 14,
    },

    mainContent: {
        padding: 16,
        marginBottom: 90,
    },
});