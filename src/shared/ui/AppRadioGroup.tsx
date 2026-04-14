import React from "react";
import { View } from "react-native";
import { AppRadioButton } from "./AppRadioButton";

interface Option {
    label: string
    value: string
}

interface Props {
    options: Option[]
    value: string
    onChange: (v: string) => void
}

export const AppRadioGroup = ({ options, value, onChange }: Props) => {
    return (
        <View style={{ gap: 12 }}>
            {options.map(o => (
                <AppRadioButton
                    key={o.value}
                    label={o.label}
                    seleced={value === o.value}
                    onPress={() => onChange(o.value)}
                />
            ))}
        </View>
    )
}