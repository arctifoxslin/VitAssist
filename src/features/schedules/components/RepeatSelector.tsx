import React from "react";
import { View } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import { RepeatType } from "../../../shared/types/Schedule";

interface Props {
    value: RepeatType
    onChange: (type: RepeatType) => void
}

export const RepeatSelector = ({ value, onChange }: Props) => {
    return (
        <RadioButton.Group
            onValueChange={(value) => onChange(value as RepeatType)}
            value={value}
        >
            <View style={{  gap: 8 }}>
                <RadioButton.Item label="Один раз" value="once" />
                <RadioButton.Item label="Каждый день" value="daily" />
                <RadioButton.Item label="Через N дней" value="every_x_days" />
                <RadioButton.Item label="По дням недели" value="weekly" />
                <RadioButton.Item label="Раз в месяц" value="monthly" />
            </View>
        </RadioButton.Group>
    )
}