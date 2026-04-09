import React, { useState } from "react";
import { View } from "react-native";
import { Button, Chip } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker"

interface Props {
    times: string[]
    onChange: (times: string[]) => void
}

export const TimePickerList = ({ times, onChange }: Props) => {
    const [showPicker, setShowPicker] = useState(false)

    const handleAddTime = (event: any, date?: Date) => {
        if(date) {
            const hh = date.getHours().toString().padStart(2, '0')
            const mm = date.getMinutes().toString().padStart(2, '0')
            onChange([...times, `${hh}:${mm}`])
        }
        setShowPicker(false)
    }

    return (
        <View style={{ gap: 12 }}>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8
            }}>
                {times.map((t, i) => (
                    <Chip
                        key={i}
                        onClose={() => onChange(times.filter((_, idx) => idx !== i))}
                    >
                        {t}
                    </Chip>
                ))}
            </View>
            <Button
                mode='outlined'
                onPress={() => setShowPicker(true)}
            >
                Добавить время
            </Button>
            {showPicker && (
                <DateTimePicker
                    mode='time'
                    value={new Date()}
                    onChange={handleAddTime}
                />
            )}
        </View>
    )
}