import React, { useState } from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppChip } from "../../../shared/ui/AppChip";
import DateTimePicker from "@react-native-community/datetimepicker"
import { lockModal, unlockModal, isModalLocked } from "../../../shared/utils/modalLock";

interface Props {
    times: string[]
    onChange: (times: string[]) => void
}

export const TimePickerList = ({ times, onChange }: Props) => {
    const [showPicker, setShowPicker] = useState(false)

    const openPicker = () => {
        if (isModalLocked()) {
            return
        }
        lockModal()
        setShowPicker(true)
    }

    const closePicker = () => {
        setShowPicker(false)
        unlockModal()
    }

    const handleAddTime = (event: any, date?: Date) => {
        if (date) {
            const hh = date.getHours().toString().padStart(2, '0')
            const mm = date.getMinutes().toString().padStart(2, '0')
            onChange([...times, `${hh}:${mm}`])
        }
        closePicker()
    }

    return (
        <View style={{ gap: 16 }}>
            {times.length > 0 && (
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {times.map((t, i) => (
                        <AppChip
                            key={i}
                            label={t}
                            onClose={() => onChange(times.filter((_, idx) => idx !== i))}
                        />
                    ))}
                </View>
            )}
            <AppButton
                title="Добавить время"
                variant='secondary'
                onPress={openPicker}
            />
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