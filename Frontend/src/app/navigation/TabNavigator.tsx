import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Analytics from '@/src/screens/analytics/Analytics';
import Home from '@/src/screens/home/Home';
import Profile from '@/src/screens/profile/Profile';
import Transcations from '@/src/screens/transcations/Transcations';

const AddPlaceholder = () => null;

const Tab = createBottomTabNavigator();

const FloatingAddButton = ({ onPress }: { onPress: () => void }) => {
    const theme = useTheme();

    return (
        <View style={styles.fabWrap}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            >
                <Icon source="plus" size={26} color={theme.colors.onPrimary} />
            </TouchableOpacity>
        </View>
    );
};

const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarShowLabel: true,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,

                tabBarLabelStyle: styles.label,

                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                        bottom: 0,
                        height: 64 + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                ],


                tabBarIcon: ({ color }) => {
                    const size = 22;

                    if (route.name === 'Home') return <Icon source="home" size={size} color={color} />;
                    if (route.name === 'Transcations') return <Icon source="receipt" size={size} color={color} />;
                    if (route.name === 'Analytics') return <Icon source="chart-bar" size={size} color={color} />;
                    if (route.name === 'Profile') return <Icon source="account" size={size} color={color} />;

                    return null;
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />

            <Tab.Screen
                name="Transcations"
                component={Transcations}
                options={{ tabBarLabel: 'Transactions' }}
            />

            <Tab.Screen
                name="Add"
                component={AddPlaceholder}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: () => null,
                    tabBarButton: () => (
                        <FloatingAddButton
                            onPress={() => {
                                console.log('Add Expense');
                            }}
                        />
                    ),
                }}
            />

            <Tab.Screen name="Analytics" component={Analytics} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default TabNavigator;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: 26,
        borderWidth: 1,
        borderTopWidth: 0,
        shadowOpacity: 0.10,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },

    label: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: '600',
    },

    fabWrap: {
        position: 'absolute',
        top: -28,
        alignSelf: 'center',
    },

    fab: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 14,
    },
});
