import Analytics from '@/src/screens/analytics/Analytics';
import AddExpense from '@/src/screens/addExpense/AddExpense';
import Home from '@/src/screens/home/Home';
import Profile from '@/src/screens/profile/Profile';
import Transcations from '@/src/screens/transcations/Transcations';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LayoutWrapper } from './LayoutWrapper';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <LayoutWrapper>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Tab' screenOptions={{ headerShown: false }}>
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
                </Stack.Navigator>
            </NavigationContainer>
        </LayoutWrapper>
    );
}

const styles = StyleSheet.create({});
