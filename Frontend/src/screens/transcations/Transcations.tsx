import { CustomHeader } from '@/src/header/CustomHeader'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, Searchbar } from 'react-native-paper'
import { lightTheme } from '@/src/theme/GlobalTheme'
import PillSegment from '@/src/styleComponents/PillSegment'
import CustomCard from '@/src/styleComponents/CustomCard'
import { dummyTransactions } from '@/src/services/constants'

const Transcations = () => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedFilter, setSelectedFilter] = useState('All')
    const styles = createStyles()
    const theme = lightTheme

    return (
        <View style={styles.container}>
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
                <Text style={styles.dateText}>Monday, February 9</Text>
                <CustomCard>
                    {dummyTransactions.map((tx) => (
                        <View key={tx.id} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View style={[styles.iconContainer, { backgroundColor: tx.iconBgColor }]}>
                                    <Icon source={tx.icon} size={24} />
                                </View>

                                <View style={{ flex: 1 }}>
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
                                        {tx.date}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </CustomCard>
            </View>
        </View>
    )
}

export default Transcations

const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: lightTheme.colors.background,
        },
        headerText: {
            fontSize: 28,
            fontWeight: '700',
            color: lightTheme.colors.onPrimary,
            marginBottom: 16,
        },
        searchBar: {
            backgroundColor: lightTheme.colors.secondaryContainer,
            borderRadius: 28,
            elevation: 0,
        },
        filterContainer: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 10,
            backgroundColor: lightTheme.colors.background,
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
            color: lightTheme.colors.onSurfaceVariant,
            marginBottom: 12,
        },
    })
