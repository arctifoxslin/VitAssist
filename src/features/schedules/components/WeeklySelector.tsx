import React from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";

const days = [
    {label: 'Пн', value: 1},
    {label: 'Вт', value: 2},
    {label: 'Ср', value: 3},
    {label: 'Чт', value: 4},
    {label: 'Пт', value: 5},
    {label: 'Сб', value: 6},
    {label: 'Вс', value: 7}
]

interface Props {
    value: number[]
    onChange: (days: number[]) => void
}

export const WeeklySelector = ({ value, onChange }: Props) => {
    const toogle = (d: number) => {
        if(value.includes(d)){
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
                <Chip
                    key={d.value}
                    selected={value.includes(d.value)}
                    onPress={() => toogle(d.value)}
                >
                    {d.label}
                </Chip>
            ))}
        </View>
    )
}