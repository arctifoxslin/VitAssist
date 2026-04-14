import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "./theme/colors";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

interface Props {
    label: string
    selected?: boolean
    onPress?: () => void
    onClose?: () => void
}

export const AppChip = ({ label, selected = false, onPress, onClose }: Props) => {
    return (
        <View style={[styles.chip, selected && styles.chipSelected]}>
            <Pressable
                onPress={onPress}
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <AppText style={{
                    color: selected ? COLORS.background : COLORS.textPrimary,
                    fontWeight: "500",
                }}>
                    {label}
                </AppText>
            </Pressable>
            {onClose && (
                <Pressable onPress={onClose} style={styles.closeButton}>
                    <Icon
                        name="x"
                        size={14}
                        color={selected ? COLORS.background : COLORS.textPrimary}
                    />
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    closeButton: {
        padding: 4,
    }
})