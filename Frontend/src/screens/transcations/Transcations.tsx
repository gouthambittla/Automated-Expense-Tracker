import { CustomHeader } from '@/src/header/CustomHeader'
import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Searchbar, useTheme } from 'react-native-paper'
import PillSegment from '@/src/styleComponents/PillSegment'
import CustomCard from '@/src/styleComponents/CustomCard'
import { useExpenses } from '@/src/store/useStore'
import CategoryIcon from '@/src/utils/CategoryIcon'
import { formatDayDateMonth } from '@/src/utils/dateUtils'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const Transcations = () => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedFilter, setSelectedFilter] = useState('All')
    const theme = useTheme()
    const styles = createStyles(theme)

    const expenses = useExpenses() || [];

    const normalizeDate = (dStr: string) => {
        if (!dStr) return null;
        const year = new Date().getFullYear();

        // Try formats using dayjs with custom parse formats
        const formats = [
            'D MMM', 'D MMMM', 'MMM D', 'MMMM D', // e.g. 10 Apr, April 10
            'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY', // common
            'YYYY/MM/DD',
        ];

        for (const fmt of formats) {
            const parsed = dayjs(dStr, fmt, true);
            if (parsed.isValid()) {
                // If year-less format, dayjs will default to current year when parsing with format
                return parsed.toDate();
            }
            // Try with appended year for day/month formats
            if (fmt === 'D MMM' || fmt === 'D MMMM' || fmt === 'MMM D' || fmt === 'MMMM D') {
                const parsedWithYear = dayjs(`${dStr} ${year}`, `${fmt} YYYY`, true);
                if (parsedWithYear.isValid()) return parsedWithYear.toDate();
            }
        }

        // ISO fallback
        const isoTry = dayjs(dStr);
        if (isoTry.isValid()) return isoTry.toDate();

        return null;
    };

    const groupExpensesByDate = (list: any[]) => {
        const groups: Record<string, any[]> = {};
        for (const item of list) {
            const d = normalizeDate(item.date);
            const key = d ? d.toISOString().slice(0, 10) : (item.date || 'unknown');
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        }

        // Convert to array sorted by date desc
        const result = Object.keys(groups).map(key => {
            const sample = groups[key][0];
            let dateObj: Date | null = null;
            if (key === 'unknown') dateObj = null;
            else {
                // key might already be ISO (YYYY-MM-DD) or original date string
                const isoTry = new Date(key + 'T00:00:00');
                if (!isNaN(isoTry.getTime())) dateObj = isoTry;
                else {
                    const norm = normalizeDate(key);
                    dateObj = norm;
                }
            }

            const label = dateObj
                ? formatDayDateMonth(dateObj)
                : String(sample.date || key);
            return { key, label, items: groups[key] };
        });

        result.sort((a, b) => {
            if (a.key === 'unknown') return 1;
            if (b.key === 'unknown') return -1;
            return new Date(b.key).getTime() - new Date(a.key).getTime();
        });

        return result;
    };

    // Filtering and search
    const matchesSearch = (tx: any, q: string) => {
        if (!q) return true;
        const s = q.toLowerCase();
        return (
            String(tx.name || '').toLowerCase().includes(s) ||
            String(tx.category || '').toLowerCase().includes(s) ||
            String(tx.merchant || '').toLowerCase().includes(s)
        );
    };

    const inSelectedRange = (tx: any, range: string) => {
        if (!range || range === 'All') return true;
        const d = normalizeDate(tx.date);
        if (!d) return false;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (range === 'Today') {
            return d.toDateString() === startOfToday.toDateString();
        }

        if (range === 'Week') {
            const diff = (startOfToday.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff < 7;
        }

        if (range === 'Month') {
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }

        return true;
    };

    const filtered = expenses.filter((tx: any) => matchesSearch(tx, searchQuery) && inSelectedRange(tx, selectedFilter));

    const grouped = groupExpensesByDate(filtered);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>
            <CustomHeader>
                <View>
                    <Text style={styles.headerText}>Transactions</Text>
                    <Searchbar
                        style={styles.searchBar}
                        placeholder="Search transactions..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        icon="magnify"
                    />
                </View>
            </CustomHeader>

            <View style={styles.filterContainer}>
                <PillSegment
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    options={[
                        { value: 'All', label: 'All' },
                        { value: 'Today', label: 'Today' },
                        { value: 'Week', label: 'Week' },
                        { value: 'Month', label: 'Month' },
                    ]}
                />
            </View>
            <View style={styles.content}>
                {grouped.length === 0 ? (
                    <Text style={styles.dateText}>No transactions</Text>
                ) : (
                    grouped.map((g) => (
                        <View key={g.key} style={{ marginBottom: 12 }}>
                            <Text style={styles.dateText}>{g.label}</Text>
                            <CustomCard style={{ marginBottom: 12, elevation: 0, shadowOpacity: 0 }} contentStyle={{ paddingHorizontal: 12 }}>
                                {g.items.map((tx: any) => (
                                    <View key={String(tx.id)} style={{ paddingVertical: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <CategoryIcon category={tx.category} entryType={tx.entryType} merchant={tx.name} size={24} bgColor={tx.iconBgColor} />

                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                                    {tx.name}
                                                </Text>
                                                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                                    {tx.category}
                                                </Text>
                                            </View>

                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                                    ₹{tx.amount}
                                                </Text>
                                                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                                                    {formatDayDateMonth(tx.date)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </CustomCard>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    )
}

export default Transcations

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        headerText: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.onPrimary,
            marginBottom: 16,
        },
        searchBar: {
            backgroundColor: theme.colors.secondaryContainer,
            borderRadius: 28,
            elevation: 0,
        },
        filterContainer: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 10,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
        iconContainer: {
            padding: 15,
            borderRadius: 28,
        },
        dateText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.onSurfaceVariant,
            marginBottom: 12,
        },
    })
