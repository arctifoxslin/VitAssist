import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { COLORS } from "./theme/colors";
import { AppText } from "./AppText";

interface MenuItem {
    label: string
    onPress: () => void
}

interface Props {
    visible: boolean
    items: MenuItem[]
    onClose: () => void
    position?: { top: number, left: number }
}

export const AppMenu = ({ visible, items, onClose, position }: Props) => {
    if (!visible) {
        return null
    }

    const [menuWidth, setMenuWidth] = useState(0)

    const safeItems: MenuItem[] = items.length > 0
        ? items
        : [{ label: "Список пуст", onPress: onClose }]

    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <View
                onLayout={e => setMenuWidth(e.nativeEvent.layout.width)}
                style={[
                    styles.menu,
                    position ? {
                        top: position.top,
                        left: position.left - menuWidth / 2,
                    } : { top: 60, right: 0 },
                ]}
            >
                {safeItems.map((item, i) => (
                    <Pressable
                        key={i}
                        onPress={() => {
                            item.onPress()
                            onClose()
                        }}
                        style={styles.item}
                    >
                        <AppText>
                            {item.label}
                        </AppText>
                    </Pressable>
                ))}
            </View>
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
        borderRadius: 8,
        paddingVertical: 8,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },

    item: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
})