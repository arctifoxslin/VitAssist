import React from "react";
import { View } from "react-native";
import { AppChip } from "../../../shared/ui/AppChip";

const days = [
    { label: 'Пн', value: 1 },
    { label: 'Вт', value: 2 },
    { label: 'Ср', value: 3 },
    { label: 'Чт', value: 4 },
    { label: 'Пт', value: 5 },
    { label: 'Сб', value: 6 },
    { label: 'Вс', value: 7 }
]

interface Props {
    value: number[]
    onChange: (days: number[]) => void
}

export const WeeklySelector = ({ value, onChange }: Props) => {
    const toogle = (d: number) => {
        if (value.includes(d)) {
            onChange(value.filter(x => x !== d))
        } else {
            onChange([...value, d])
        }
    }

    return (
        <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8
        }}>
            {days.map(d => (
                <AppChip
                    key={d.value}
                    label={d.label}
                    selected={value.includes(d.value)}
                    onPress={() => toogle(d.value)}
                />
            ))}
        </View>
    )
}