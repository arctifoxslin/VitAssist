import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { COLORS } from "./theme/colors";

export const AppCard = ({ style, children, ...rest }: ViewProps) => {
    return (
        <View style={[styles.card, style]} {...rest}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
});
