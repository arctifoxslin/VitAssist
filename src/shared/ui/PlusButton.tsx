import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Icon, IconName } from "./Icon";
import { COLORS } from "./theme/colors";

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
    color = COLORS.background,
    backgroundColor = COLORS.primary,
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
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    }
})