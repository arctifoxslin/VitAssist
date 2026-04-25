import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { COLORS } from "./theme/colors";
interface Props extends ViewProps {
    row?: boolean,
}

export const AppCard = ({ style, children, row, ...rest }: Props) => {
    return (
        <View style={[styles.card, style, row && styles.rowdirection]} {...rest}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        gap: 12,
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.shadow,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    rowdirection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});