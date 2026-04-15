import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { selectActiveProducts } from "../../products/productsSelectors";
import { AppButton } from "../../../shared/ui/AppButton";
import { View } from "react-native";
import { AnimatedMenuIcon } from "../../../shared/ui/AnimatedMenuIcon";

interface Props {
    value: string | null
    onChange: (productId: string) => void
    openDropdown: (
        items: { label: string, onPress: () => void }[],
        position: { x: number, y: number }
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
                    y: py + height
                }
            )
        })
    }

    return (
        <View ref={buttonRef}>
            <AppButton
                title={selected ? selected.name : "Выберите препарат"}
                variant="secondary"
                onPress={toggleMenu}
                rightElement={<AnimatedMenuIcon open={dropdownOpen} />}
            />
        </View>
    )
}