import { lightTheme } from "@/src/theme/GlobalTheme";

export const dummyTransactions: any[] = [
    {
        id: '1',
        name: 'Spotify',
        category: 'Entertainment',
        amount: 699,
        date: 'Feb 10',
        icon: "movie-open",
        iconBgColor: lightTheme.colors.tertiaryContainer,
    },
    {
        id: '2',
        name: 'Dinner at Bistro',
        category: 'Food',
        amount: 1255,
        date: 'Feb 10',
        icon: "silverware-fork-knife",
        iconBgColor: lightTheme.colors.errorContainer,
    },
    {
        id: '3',
        name: 'Lunch',
        category: 'Food',
        amount: 450,
        date: 'Feb 10',
        icon: "silverware-fork-knife",
        iconBgColor: lightTheme.colors.errorContainer,
    },
    {
        id: '4',
        name: 'Groceries',
        category: 'Shopping',
        amount: 2020,
        date: 'Feb 9',
        icon: "shopping-outline",
        iconBgColor: lightTheme.colors.tertiaryContainer,
    },
    {
        id: '5',
        name: 'Electricity Bill',
        category: 'Bills',
        amount: 2300,
        date: 'Feb 9',
        icon: "receipt-outline",
        iconBgColor: lightTheme.colors.secondaryContainer,
    },
];