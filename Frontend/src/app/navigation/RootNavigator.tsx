import Analytics from '@/src/screens/analytics/Analytics';
import AddExpense from '@/src/screens/addExpense/AddExpense';
import Home from '@/src/screens/home/Home';
import Profile from '@/src/screens/profile/Profile';
import Transcations from '@/src/screens/transcations/Transcations';
import LoginScreen from '@/src/screens/login/LoginScreen';
import SignupScreen from '@/src/screens/signup/SignupScreen';
import { useAuth } from '@/src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LayoutWrapper } from './LayoutWrapper';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, loading } = useAuth();
    const theme = useTheme();

    if (loading) {
        return (
            <LayoutWrapper>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <>
                            <Stack.Screen
                                name='Tab'
                                component={TabNavigator}
                                options={{ animation: 'slide_from_bottom' }}
                            />
                            <Stack.Screen name='Home' component={Home} />
                            <Stack.Screen name='Analytics' component={Analytics} />
                            <Stack.Screen name='Transcations' component={Transcations} />
                            <Stack.Screen name='Profile' component={Profile} />
                            <Stack.Screen
                                name='AddExpense'
                                component={AddExpense}
                                options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name='Login' component={LoginScreen} />
                            <Stack.Screen name='Signup' component={SignupScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </LayoutWrapper>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
