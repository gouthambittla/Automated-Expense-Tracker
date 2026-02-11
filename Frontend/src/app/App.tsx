import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme } from "../theme/GlobalTheme";
import RootNavigator from './navigation/RootNavigator';

export default function App() {
    return (
        <PaperProvider theme={lightTheme}>
            <RootNavigator />
        </PaperProvider>
    );
}

