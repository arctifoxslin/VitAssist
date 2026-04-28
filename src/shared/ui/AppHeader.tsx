import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

interface Props {
    title: string
    onMenuPress: () => void
}

export const AppHeader = ({ title, onMenuPress }: Props) => {
    return (
        <View style={styles.container}>
            <Pressable onPress={onMenuPress} style={styles.menuButton}>
                <Icon name='menu' size={22} />
            </Pressable>

            <AppText variant="title" style={styles.title}>
                {title}
            </AppText>

            <View style={{ width: 40 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 56,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        elevation: 4,
        zIndex: 10,
    },

    menuButton: {
        padding: 8,
    },

    title: {
        flex: 1,
        textAlign: "center",
    }
})