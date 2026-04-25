import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { selectActiveProducts } from "../../products/productsSelectors";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../../shared/ui/theme/colors";
import { AppCard } from "../../../shared/ui/AppCard";
import { AppText } from "../../../shared/ui/AppText";
import { Icon } from "../../../shared/ui/Icon";

interface Props {
    value: string | null
    onChange: (productId: string) => void
    openDropdown: (
        items: { label: string, onPress: () => void }[],
        position: { x: number, y: number, width: number }
    ) => void
    dropdownOpen: boolean
}

export const ProductSelector = ({ value, onChange, openDropdown, dropdownOpen }: Props) => {
    const products = useSelector(selectActiveProducts)
    const buttonRef = useRef<View>(null)
    const selected = products.find(p => p.id === value)

    const toggleMenu = () => {
        buttonRef.current?.measure((fx, fy, width, height, px, py) => {
            openDropdown(
                products.map(p => ({
                    label: p.name,
                    onPress: () => onChange(p.id)
                })),
                {
                    x: px + width / 2,
                    y: py + height / 4,
                    width,
                }
            )
        })
    }

    return (
        <View ref={buttonRef} style={styles.container}>
            <Pressable onPress={toggleMenu}>
                <AppCard style={styles.field}>
                    <AppText style={{ opacity: selected ? 1 : 0.6 }}>
                        {selected ? selected.name : "Выберите препарат"}
                    </AppText>
                    <Icon
                        name={dropdownOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#555"
                    />

                </AppCard>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 6,
    },

    field: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 12,
        paddingVertical: 12,

        borderRadius: 12,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
})