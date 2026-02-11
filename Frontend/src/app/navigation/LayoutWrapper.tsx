import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type LayoutWrapperProps = {
    children: React.ReactNode;
};

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
    children,
}) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
});