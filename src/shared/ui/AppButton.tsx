import React, { useRef } from "react";
import {
    Pressable,
    StyleSheet,
    View,
    ActivityIndicator,
    GestureResponderEvent,
    Animated
} from "react-native";
import { AppText } from "./AppText";
import { COLORS } from "./theme/colors";
import { Icon, IconName } from "./Icon";

type Variant = "primary" | "secondary" | "danger"

interface Props {
    title: string
    onPress: (e: GestureResponderEvent) => void
    variant?: Variant
    disabled?: boolean
    loading?: boolean
    icon?: IconName
    rightElement?: React.ReactNode
}

export const AppButton = ({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    icon,
    rightElement,
}: Props) => {
    const scale = useRef(new Animated.Value(1)).current

    const handlePressIn = () => {
        Animated.timing(scale, {
            toValue: 0.97,
            duration: 80,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
        }).start()
    }

    const styles = getStyles(variant, disabled)

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                android_ripple={{ color: "#ffffff30" }}
                disabled={disabled || loading}
                style={styles.button}
            >
                {loading ? (
                    <ActivityIndicator color={styles.text.color} />
                ) : (
                    <View style={styles.content}>
                        {icon &&
                            <Icon name={icon} size={18} color={styles.text.color} />
                        }
                        <AppText style={styles.text}>
                            {title}
                        </AppText>

                        {rightElement && (
                            <View style={{ marginLeft: 8 }}>
                                {rightElement}
                            </View>
                        )}
                    </View>
                )}
            </Pressable>
        </Animated.View>
    )
}

const getStyles = (variant: Variant, disabled: boolean) => {
    const background = variant === "primary"
        ? COLORS.primary
        : variant == "secondary"
            ? COLORS.surface
            : COLORS.danger

    const textColor = variant === "secondary"
        ? COLORS.textPrimary
        : COLORS.background

    return StyleSheet.create({
        button: {
            height: 48,
            borderRadius: 10,
            backgroundColor: disabled
                ? COLORS.textDisabled
                : background,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
        },

        text: {
            color: disabled
                ? "#ffffff"
                : textColor,
            fontSize: 16,
            fontWeight: "600",
        },

        content: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
    })
}