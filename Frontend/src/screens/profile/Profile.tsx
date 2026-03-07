import { useAuth } from '@/src/context/AuthContext';
import { CustomHeader } from '@/src/header/CustomHeader';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

const Profile = () => {
    const theme = useTheme();
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <CustomHeader>
                <Text variant="headlineSmall" style={{ color: theme.colors.onPrimary }}>
                    Profile
                </Text>
                <Text
                    variant="bodyMedium"
                    style={[styles.headerSubtitle, { color: theme.colors.onPrimary }]}
                >
                    Manage your account settings.
                </Text>
            </CustomHeader>

            <View style={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Text variant="titleMedium">Signed in as</Text>
                    <Text variant="bodyLarge" style={styles.emailText}>
                        {user?.email ?? 'No email available'}
                    </Text>
                </View>

                <Button
                    mode="contained"
                    icon="logout"
                    onPress={logout}
                    contentStyle={styles.logoutContent}
                >
                    Logout
                </Button>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerSubtitle: {
        marginTop: 8,
        opacity: 0.9,
    },

    content: {
        padding: 16,
        gap: 16,
    },

    card: {
        borderRadius: 16,
        padding: 16,
    },

    emailText: {
        marginTop: 8,
    },

    logoutContent: {
        minHeight: 48,
    },
});
