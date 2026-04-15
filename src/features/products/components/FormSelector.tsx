import React, { useRef } from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { AnimatedMenuIcon } from "../../../shared/ui/AnimatedMenuIcon";
import { FormUnitType, FORM_LABELS } from "../../../shared/types/units";

interface Props {
    value: FormUnitType
    onChange: (v: FormUnitType) => void
    openDropdown: (
        items: { label: string, onPress: () => void }[],
        position: { x: number, y: number }
    ) => void
    dropdownOpen: boolean
}

export const FormSelector = ({
    value,
    onChange,
    openDropdown,
    dropdownOpen
}: Props) => {
    const ref = useRef<View>(null)

    const openSelector = () => {
        const items = (Object.keys(FORM_LABELS) as FormUnitType[]).map((key) => ({
            label: FORM_LABELS[key],
            onPress: () => onChange(key),
        }))
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
                title={FORM_LABELS[value]}
                variant="secondary"
                onPress={openSelector}
                rightElement={<AnimatedMenuIcon open={dropdownOpen} />}
            />
        </View>
    )
}