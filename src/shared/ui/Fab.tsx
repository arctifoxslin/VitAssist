import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Icon, IconName } from "./Icon";

interface Props {
    icon: IconName
    onPress: () => void
    size?: number
    color?: string
    backgroundColor?: string
    style?: ViewStyle
}

export const Fab = ({
    icon,
    onPress,
    size = 28,
    color = "white",
    backgroundColor = "#6200ee",
    style,
}: Props) => {
    return (
        <Pressable
            style={[
                styles.container,
                { backgroundColor },
                style,
            ]}
            onPress={onPress}
        >
            <Icon name={icon} color={color} size={size} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    }
})