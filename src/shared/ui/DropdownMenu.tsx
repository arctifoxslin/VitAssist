import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { COLORS } from "./theme/colors";
import { AppText } from "./AppText";

export interface DropdownItem {
    label: string
    onPress: () => void
    disabled?: boolean
}

interface Props {
    visible: boolean
    items: DropdownItem[]
    position: { x: number, y: number, width?: number }
    onClose: () => void
}


export const DropdownMenu = ({ visible, items, position, onClose }: Props) => {
    const [menuWidth, setMenuWidth] = useState(0)
    const opacity = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0.95)).current

    const safeItems = items.length > 0
        ? items
        : [{ label: "Список пуст", onPress: onClose, disabled: true }]

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 120,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 120,
                    useNativeDriver: true,
                }),
            ]).start()
        } else {
            opacity.setValue(0)
            scale.setValue(0.95)
        }
    }, [visible])

    if (!visible) {
        return null
    }

    const screenWidth = Dimensions.get("window").width

    const left = Math.max(8,
        Math.min(position.x - menuWidth / 2, screenWidth - menuWidth - 8)
    )

    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <Animated.View
                onLayout={(e) => setMenuWidth(e.nativeEvent.layout.width)}
                style={[
                    styles.menu,
                    {
                        top: position.y + 4,
                        left,
                        width: position.width ?? undefined,
                        opacity,
                        transform: [{ scale }],
                    },
                ]}
            >
                <ScrollView
                    style={{ maxHeight: 260 }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                >
                    {safeItems.map((item, i) => {
                        return (
                            <Pressable
                                key={i}
                                onPress={() => {
                                    if (!item.disabled) {
                                        item.onPress()
                                        onClose()
                                    }
                                }}
                                style={[
                                    styles.item,
                                    item.disabled && { opacity: 0.4 },
                                ]}
                            >
                                <AppText>
                                    {item.label}
                                </AppText>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </Animated.View>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    menu: {
        position: "absolute",
        backgroundColor: COLORS.surface,
        borderRadius: 12,

        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        minWidth: 160,
    },

    item: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
    },
})