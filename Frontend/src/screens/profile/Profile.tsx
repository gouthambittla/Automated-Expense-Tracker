import { useAuth } from '@/src/context/AuthContext';
import { CustomHeader } from '@/src/header/CustomHeader';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useGetUser, useSetUser } from '@/src/store/useStore';
import { getUserInfoRequest, updateUserBudgetRequest } from '@/src/services/authApi';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Profile = () => {
    const theme = useTheme();
    const { user: authUser, logout } = useAuth();
    const storeUser = useGetUser();

    const getInitials = (str?: string | null) => {
        if (!str) return 'U';
        const parts = str.trim().split(/\s+/);
        const initials = parts.map(p => (p && p[0]) || '').join('').slice(0, 2).toUpperCase();
        return initials || 'U';
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [monthlyThreshold, setMonthlyThreshold] = useState('');
    const [dailyThreshold, setDailyThreshold] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [activeLimit, setActiveLimit] = useState<'monthly' | 'daily'>('monthly');
    const setStoreUser = useSetUser();
    const token = (useAuth() as any).token;

    const handleSave = () => {
        const payload: any = {};
        const parsed = inputValue === '' ? null : Number(inputValue);
        if (activeLimit === 'monthly') payload.monthlyBudget = parsed;
        else payload.dailyBudget = parsed;

        if (!token) {
            // fallback: update local only
            if (activeLimit === 'monthly') setMonthlyThreshold(inputValue);
            else setDailyThreshold(inputValue);
            setModalVisible(false);
            return;
        }

        updateUserBudgetRequest(token, payload)
            .then((res) => {
                const user = res.user;
                setStoreUser(user);
                setMonthlyThreshold(user.monthly_budget ? String(user.monthly_budget) : '');
                setDailyThreshold(user.daily_budget ? String(user.daily_budget) : '');
                setModalVisible(false);
            })
            .catch((err) => {
                console.error('Failed to update budget', err);
                // still update locally
                if (activeLimit === 'monthly') setMonthlyThreshold(inputValue);
                else setDailyThreshold(inputValue);
                setModalVisible(false);
            });
    };

    const handleOpen = (limit: 'monthly' | 'daily') => {
        setActiveLimit(limit);
        setInputValue(limit === 'monthly' ? monthlyThreshold : dailyThreshold);
        setModalVisible(true);
    };

    useEffect(() => {
        if (!token) return;
        getUserInfoRequest(token)
            .then((res) => {
                const user = res.user;
                setStoreUser(user);
                setMonthlyThreshold(user?.monthly_budget ? String(user.monthly_budget) : '');
                setDailyThreshold(user?.daily_budget ? String(user.daily_budget) : '');
            })
            .catch((err) => {
                console.error('Failed to fetch user info', err);
            });
    }, [token, setStoreUser]);

    const formattedMonthly = Number(monthlyThreshold).toLocaleString('en-IN');
    const formattedDaily = Number(dailyThreshold).toLocaleString('en-IN');

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
                {/* Signed in card */}
                <Pressable style={[styles.card, styles.profileCard, { backgroundColor: theme.colors.surface }]} onPress={() => { }}>
                    <View style={styles.profileLeft}>
                        <Avatar.Text
                            size={48}
                            label={getInitials(storeUser?.name ?? authUser?.email)}
                            color={theme.colors.onPrimary}
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                        <View style={styles.profileInfo}>
                            <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="tail">
                                {storeUser?.name ?? authUser?.name ?? authUser?.email ?? 'Unknown User'}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1} ellipsizeMode="tail">
                                {storeUser?.email ?? authUser?.email ?? 'No email available'}
                            </Text>
                        </View>
                    </View>
                </Pressable>

                {/* Threshold card */}
                <Pressable
                    style={[styles.card, styles.thresholdCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => handleOpen('monthly')}
                    accessibilityRole="button"
                >
                    {/* Left: icon + text */}
                    <View style={styles.thresholdLeft}>
                        <MaterialCommunityIcons
                            name="trending-up"
                            size={20}
                            color={theme.colors.onSurfaceVariant}
                        />
                        <View style={styles.thresholdTextContainer}>
                            <Text variant="titleMedium">Monthly Budget</Text>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                Set your monthly budget
                            </Text>
                        </View>
                    </View>

                    {/* Right: amount + edit */}
                    <View style={styles.thresholdRight}>
                        <Text
                            variant="titleMedium"
                            style={{ color: theme.colors.primary, fontWeight: '600' }}
                        >
                            ₹{formattedMonthly}
                        </Text>
                        <View style={styles.editTouch} pointerEvents="none">
                            <MaterialCommunityIcons
                                name="pencil"
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </View>
                    </View>
                </Pressable>

                <Pressable
                    style={[styles.card, styles.thresholdCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => handleOpen('daily')}
                    accessibilityRole="button"
                >
                    {/* Left: icon + text */}
                    <View style={styles.thresholdLeft}>
                        <MaterialCommunityIcons
                            name="trending-up"
                            size={20}
                            color={theme.colors.onSurfaceVariant}
                        />
                        <View style={styles.thresholdTextContainer}>
                            <Text variant="titleMedium">Daily Budget</Text>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                Set your daily budget
                            </Text>
                        </View>
                    </View>

                    {/* Right: amount + edit */}
                    <View style={styles.thresholdRight}>
                        <Text
                            variant="titleMedium"
                            style={{ color: theme.colors.primary, fontWeight: '600' }}
                        >
                            ₹{formattedDaily}
                        </Text>
                        <View style={styles.editTouch} pointerEvents="none">
                            <MaterialCommunityIcons
                                name="pencil"
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </View>
                    </View>
                </Pressable>

                <Button mode="contained" icon="logout" onPress={logout} contentStyle={styles.logoutContent}>
                    Logout
                </Button>
            </View>

            {/* Edit Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                        <Text variant="titleLarge" style={styles.modalTitle}>
                            {activeLimit === 'monthly' ? 'Set Monthly Budget' : 'Set Daily Budget'}
                        </Text>

                        <TextInput
                            label={activeLimit === 'monthly' ? 'Monthly Budget Amount' : 'Daily Budget Amount'}
                            value={inputValue}
                            onChangeText={setInputValue}
                            keyboardType="numeric"
                            mode="outlined"
                            left={<TextInput.Affix text="₹" />}
                            style={styles.input}
                        />

                        <Text
                            variant="bodySmall"
                            style={[styles.inputHelper, { color: theme.colors.onSurfaceVariant }]}
                        >
                            {activeLimit === 'monthly'
                                ? 'Set your monthly budget to track expenses'
                                : 'Set your daily budget to track expenses'}
                        </Text>

                        <View style={styles.modalActions}>
                            <Button mode="text" onPress={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button mode="contained" onPress={handleSave}>
                                Save
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerSubtitle: { marginTop: 8, opacity: 0.9 },

    content: { padding: 16, gap: 16 },

    card: { borderRadius: 16, padding: 16 },

    emailText: { marginTop: 8 },

    // ── Threshold card ──────────────────────────────────────────
    thresholdCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    // icon + text side-by-side
    thresholdLeft: {
        flex: 1,
        flexDirection: 'row',      // ← was 'column', now 'row'
        alignItems: 'center',
        gap: 12,
    },

    thresholdTextContainer: {
        flex: 1,
        gap: 2,
    },

    // amount + pencil
    thresholdRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0,
    },

    editTouch: {
        padding: 6,
        borderRadius: 12,
    },

    // profile card
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },

    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },

    profileRight: {
        marginLeft: 12,
    },

    logoutContent: { minHeight: 48 },

    // ── Modal ───────────────────────────────────────────────────
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    modalCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        gap: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },

    modalTitle: { fontWeight: '600', marginBottom: 4 },

    input: { backgroundColor: 'transparent' },

    inputHelper: { marginTop: -4 },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
    },
});                  