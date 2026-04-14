import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { COLORS } from "./theme/colors";
import { AppText } from "./AppText";

interface Props {
    label: string
    seleced: boolean
    onPress: () => void
}

export const AppRadioButton = ({ label, seleced, onPress }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={[styles.circle, seleced && styles.circleSelected]}>
                {seleced && <View style={styles.dot} />}
            </View>
            <AppText>
                {label}
            </AppText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    circleSelected: {
        borderColor: COLORS.primaryDark
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
})