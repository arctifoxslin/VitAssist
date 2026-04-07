import React from "react";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { PaperProvider } from "react-native-paper";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PaperProvider>
                {children}
            </PaperProvider>
        </Provider>
    )
}