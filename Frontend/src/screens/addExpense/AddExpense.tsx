import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Icon, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { createExpenseRequest, getExpensesRequest } from '@/src/services/expenseAPI';
import { useAddExpense, useSetExpenses } from '@/src/store/useStore';
import { pickIconName } from '@/src/utils/CategoryIcon';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const mapExpenseToStoreItem = (expense: any, fallbackIndex = 0, tertiaryContainer?: string) => ({
    id: expense.id ?? fallbackIndex,
    name: expense.title || expense.category || expense.paid_to || expense.payment_for || 'Expense',
    category: expense.category || expense.payment_for || '',
    amount: expense.amount ?? expense.value ?? 0,
    date: expense.payment_date || expense.paymentDate || expense.created_at,
    icon: pickIconName(expense.category, expense.entry_type),
    entryType: expense.entry_type,
    iconBgColor: tertiaryContainer,
});

const AddExpense = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const { token } = useAuth();
    const addExpense = useAddExpense();
    const setExpenses = useSetExpenses();

    const isWide = width >= 700;
    const screenBg = theme.dark ? theme.colors.surface : '#ECECEC';
    const cardBg = theme.dark ? theme.colors.surfaceVariant : '#F8F8F8';

    const [activeCategory, setActiveCategory] = useState('Food');
    const [customCategory, setCustomCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [entryType, setEntryType] = useState<'Expense' | 'Paid to Person'>('Expense');
    const [paidToPersonName, setPaidToPersonName] = useState('');
    const [paidToPersonFor, setPaidToPersonFor] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const paymentMethods = ['Cash', 'Card', 'UPI', 'Bank Transfer'];
    const formattedDate = formatDate(selectedDate);

    const onAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) return;
        if (parts[1] && parts[1].length > 2) return;
        setAmount(cleaned);
    };

    const normalizeEntryType = (value: 'Expense' | 'Paid to Person') => {
        return value === 'Expense' ? 'expense' : 'paid_to_person';
    };

    const normalizePaymentMethod = (value: string) => {
        return value.toLowerCase().replace(/\s+/g, '_');
    };

    const onSaveExpense = async () => {
        const parsedAmount = Number(amount);

        if (!token) {
            Alert.alert('Authentication error', 'Please login again.');
            return;
        }

        if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert('Invalid amount', 'Please enter a valid expense amount.');
            return;
        }

        if (entryType === 'Expense') {
            const finalCategory = activeCategory === 'Other' ? customCategory.trim() : activeCategory;

            if (!finalCategory) {
                Alert.alert('Missing category', 'Please enter a category.');
                return;
            }
        }

        if (entryType === 'Paid to Person' && !paidToPersonName.trim()) {
            Alert.alert('Missing name', 'Please enter the person name.');
            return;
        }

        try {
            setSubmitting(true);

            const finalCategory =
                entryType === 'Expense'
                    ? activeCategory === 'Other'
                        ? customCategory.trim()
                        : activeCategory
                    : null;

            const payload = {
                entryType: normalizeEntryType(entryType),
                sourceType: 'manual',
                amount: parsedAmount,
                currency: 'INR',
                title:
                    entryType === 'Expense'
                        ? finalCategory || 'Expense'
                        : `Paid to ${paidToPersonName.trim()}`,
                category: entryType === 'Expense' ? finalCategory : null,
                paidTo: entryType === 'Paid to Person' ? paidToPersonName.trim() : null,
                paymentFor: entryType === 'Paid to Person' ? paidToPersonFor.trim() || null : null,
                paymentMethod: normalizePaymentMethod(paymentMethod),
                paymentDate: selectedDate.toISOString(),
                notes: notes.trim() || null,
                paymentProofUrl: null,
                isUserVerified: true,
                metadata: {
                    createdFrom: 'mobile_app',
                },
            };

            const created = await createExpenseRequest(token, payload);

            if (created?.expense) {
                addExpense(mapExpenseToStoreItem(created.expense, 0, theme.colors.tertiaryContainer));
            }

            // refresh full list from server and update store
            try {
                const data = await getExpensesRequest(token);
                const expenses = data.expenses || [];

                const mapped = expenses.map((e: any, idx: number) => mapExpenseToStoreItem(e, idx, theme.colors.tertiaryContainer));

                setExpenses(mapped);
            } catch (err) {
                console.error('Failed to add created expense to store as fallback', err);
            }

            Alert.alert('Success', 'Expense added successfully');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Failed to save expense', error?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const onDateChange = (event: DateTimePickerEvent, pickedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'dismissed' || !pickedDate) return;
        setSelectedDate(pickedDate);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: screenBg }]}>
            <ScrollView
                contentContainerStyle={[styles.contentContainer, { maxWidth: isWide ? 760 : 520 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: theme.colors.onSurface, fontSize: isWide ? 38 : 30 }]}>
                        Add Expense
                    </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
                        <Icon source="close" size={30} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                <View style={styles.amountHeader}>
                    <Text
                        style={[
                            styles.amountLabel,
                            { color: theme.colors.onSurfaceVariant, fontSize: isWide ? 24 : 18 },
                        ]}
                    >
                        Amount
                    </Text>
                </View>

                <View style={styles.amountRow}>
                    <Text style={[styles.currency, { color: theme.colors.onSurface, fontSize: isWide ? 42 : 34 }]}>
                        {'\u20B9'}
                    </Text>
                    <TextInput
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={onAmountChange}
                        placeholder="0.00"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={[
                            styles.amountValue,
                            { color: theme.colors.onSurfaceVariant, fontSize: isWide ? 52 : 40 },
                        ]}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: isWide ? 24 : 20 }]}>
                    Entry Type
                </Text>
                <View style={styles.typeRow}>
                    {(['Expense', 'Paid to Person'] as const).map((type) => {
                        const isActive = entryType === type;
                        return (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setEntryType(type)}
                                style={[
                                    styles.typeChip,
                                    {
                                        borderColor: theme.colors.outline,
                                        backgroundColor: isActive ? theme.colors.primaryContainer : 'transparent',
                                    },
                                ]}
                            >
                                <Icon
                                    source={type === 'Expense' ? 'wallet-outline' : 'account-cash-outline'}
                                    size={18}
                                    color={isActive ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                                />
                                <Text
                                    style={[
                                        styles.typeChipLabel,
                                        {
                                            color: isActive ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                                            fontSize: isWide ? 16 : 14,
                                        },
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {entryType === 'Expense' ? (
                    <>
                        <Text
                            style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: isWide ? 24 : 20 }]}
                        >
                            Category
                        </Text>
                        <View style={styles.chipsRow}>
                            {categories.map((category) => {
                                const isActive = activeCategory === category;
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        onPress={() => setActiveCategory(category)}
                                        style={[
                                            styles.chip,
                                            {
                                                borderColor: theme.colors.outline,
                                                backgroundColor: isActive ? theme.colors.surfaceVariant : 'transparent',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipLabel,
                                                { color: theme.colors.onSurface, fontSize: isWide ? 18 : 15 },
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {activeCategory === 'Other' ? (
                            <View
                                style={[
                                    styles.notesBox,
                                    { borderColor: theme.colors.outline, backgroundColor: cardBg, minHeight: 78 },
                                ]}
                            >
                                <TextInput
                                    value={customCategory}
                                    onChangeText={setCustomCategory}
                                    placeholder="Type your category"
                                    placeholderTextColor={theme.colors.onSurfaceVariant}
                                    style={[styles.inlineInput, { color: theme.colors.onSurface, fontSize: isWide ? 18 : 16 }]}
                                />
                            </View>
                        ) : null}
                    </>
                ) : null}

                {entryType === 'Paid to Person' ? (
                    <View style={[styles.personCard, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}>
                        <View style={styles.personTitleRow}>
                            <Icon source="account-arrow-right-outline" size={20} color={theme.colors.primary} />
                            <Text style={[styles.personTitle, { color: theme.colors.onSurface }]}>Paid To</Text>
                        </View>
                        <TextInput
                            value={paidToPersonName}
                            onChangeText={setPaidToPersonName}
                            placeholder="Person name"
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            style={[styles.inlineInput, { color: theme.colors.onSurface, fontSize: isWide ? 18 : 16 }]}
                        />
                        <TextInput
                            value={paidToPersonFor}
                            onChangeText={setPaidToPersonFor}
                            placeholder="What was this for?"
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            style={[styles.inlineInput, { color: theme.colors.onSurface, fontSize: isWide ? 18 : 16 }]}
                        />
                    </View>
                ) : null}

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.field, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}
                    onPress={() => setShowPaymentMethods((prev) => !prev)}
                >
                    <Text
                        style={[
                            styles.fieldText,
                            { color: theme.colors.onSurfaceVariant, fontSize: isWide ? 22 : 18 },
                        ]}
                    >
                        {paymentMethod}
                    </Text>
                    <Icon source="chevron-down" size={22} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>

                {showPaymentMethods ? (
                    <View style={[styles.paymentList, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={styles.paymentItem}
                                onPress={() => {
                                    setPaymentMethod(method);
                                    setShowPaymentMethods(false);
                                }}
                            >
                                <Text style={[styles.paymentItemText, { color: theme.colors.onSurface }]}>{method}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : null}

                <View style={[styles.dateFieldWrap, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}>
                    <Text
                        style={[
                            styles.dateLabel,
                            {
                                color: theme.colors.onSurfaceVariant,
                                backgroundColor: screenBg,
                                fontSize: isWide ? 16 : 14,
                            },
                        ]}
                    >
                        Date
                    </Text>
                    <TouchableOpacity style={styles.dateInnerRow} onPress={() => setShowDatePicker(true)}>
                        <Text style={[styles.dateValue, { color: theme.colors.onSurface, fontSize: isWide ? 22 : 18 }]}>
                            {formattedDate}
                        </Text>
                        <Icon source="calendar-blank-outline" size={20} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                {showDatePicker ? (
                    <View style={[styles.pickerWrap, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}>
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                        {Platform.OS === 'ios' ? (
                            <TouchableOpacity
                                style={[styles.pickerDone, { backgroundColor: theme.colors.primary }]}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={[styles.pickerDoneText, { color: theme.colors.onPrimary }]}>Done</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}

                <View style={[styles.notesBox, { borderColor: theme.colors.outline, backgroundColor: cardBg }]}>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notes"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        multiline
                        textAlignVertical="top"
                        style={[styles.notesInput, { color: theme.colors.onSurface, fontSize: isWide ? 20 : 17 }]}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.receiptButton, { borderColor: theme.colors.primary }]}
                    onPress={() => Alert.alert('Add receipt', 'Receipt upload will be connected next.')}
                >
                    <Icon source="camera-outline" size={21} color={theme.colors.primary} />
                    <Text style={[styles.receiptText, { color: theme.colors.primary, fontSize: isWide ? 21 : 18 }]}>
                        Add Receipt
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor: submitting ? theme.colors.surfaceDisabled : theme.colors.primary,
                        },
                    ]}
                    onPress={onSaveExpense}
                    disabled={submitting}
                >
                    <Text style={[styles.saveButtonText, { color: theme.colors.onPrimary }]}>
                        {submitting ? 'Saving...' : 'Save Expense'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddExpense;


const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    contentContainer: {
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: { fontWeight: '700' },
    amountHeader: { marginTop: 18, alignItems: 'center' },
    amountLabel: { fontWeight: '500' },
    amountRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 12,
    },
    currency: { fontWeight: '500' },
    amountValue: {
        minWidth: 120,
        paddingVertical: 0,
        fontWeight: '400',
        textAlign: 'left',
    },
    sectionTitle: { marginTop: 28, fontWeight: '700' },
    chipsRow: {
        marginTop: 18,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    typeRow: {
        marginTop: 14,
        flexDirection: 'row',
        gap: 10,
    },
    typeChip: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    typeChipLabel: { fontWeight: '600' },
    chip: {
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    chipLabel: { fontWeight: '500' },
    field: {
        marginTop: 20,
        minHeight: 58,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldText: { fontWeight: '500' },
    paymentList: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    paymentItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    paymentItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateFieldWrap: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        position: 'relative',
    },
    dateLabel: {
        position: 'absolute',
        top: -11,
        left: 12,
        paddingHorizontal: 6,
    },
    dateInnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateValue: {
        flex: 1,
        paddingVertical: 8,
        fontWeight: '500',
    },
    pickerWrap: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    pickerDone: {
        alignSelf: 'flex-end',
        marginTop: 4,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    pickerDoneText: {
        fontSize: 14,
        fontWeight: '700',
    },
    notesBox: {
        marginTop: 16,
        minHeight: 140,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    inlineInput: {
        minHeight: 48,
        paddingVertical: 10,
    },
    personCard: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        rowGap: 6,
    },
    personTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    personTitle: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    notesInput: {
        minHeight: 118,
    },
    receiptButton: {
        marginTop: 18,
        minHeight: 54,
        borderWidth: 1,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 10,
    },
    receiptText: {
        fontWeight: '600',
    },
    saveButton: {
        marginTop: 12,
        minHeight: 54,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 17,
        fontWeight: '700',
    },
});