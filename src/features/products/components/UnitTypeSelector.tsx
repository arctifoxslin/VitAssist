import React, { useRef } from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { AnimatedMenuIcon } from "../../../shared/ui/AnimatedMenuIcon";
import { FormUnitType, UnitType, UNIT_TYPES_BY_FORM, UNIT_TYPE_LABELS } from "../../../shared/types/units";

interface Props {
    form: FormUnitType
    value: UnitType
    onChange: (v: UnitType) => void
    openDropdown: (
        items: { label: string, onPress: () => void }[],
        position: { x: number, y: number }
    ) => void
    dropdownOpen: boolean
}

export const UnitTypeSelector = ({
    form,
    value,
    onChange,
    openDropdown,
    dropdownOpen
}: Props) => {
    const ref = useRef<View>(null)

    const openSelector = () => {
        const items = UNIT_TYPES_BY_FORM[form].map((unit) => ({
            label: UNIT_TYPE_LABELS[unit],
            onPress: () => onChange(unit)
        }));
        ref.current?.measure((fx, fy, width, height, px, py) => {
            openDropdown(items, {
                x: px + width / 2,
                y: py + height
            })
        })
    }

    return (
        <View ref={ref}>
            <AppButton
                title={UNIT_TYPE_LABELS[value]}
                variant="secondary"
                onPress={openSelector}
                rightElement={<AnimatedMenuIcon open={dropdownOpen} />}
            />
        </View>
    )

}