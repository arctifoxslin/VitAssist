import React, { useState } from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { lockModal, unlockModal, isModalLocked } from "../../../shared/utils/modalLock";

interface Props {
    startDate: number
    endDate?: number
    onChange: (start: number, end?: number) => void
}

export const DateRangePicker = ({ startDate, endDate, onChange }: Props) => {
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)

    const openStartPicker = () => {
        if (isModalLocked()) {
            return
        }
        lockModal()
        setShowStart(true)
    }

    const openEndPicker = () => {
        if (isModalLocked()) {
            return
        }
        lockModal()
        setShowEnd(true)
    }

    const closeStartPicker = () => {
        setShowStart(false)
        unlockModal()
    }

    const closeEndPicker = () => {
        setShowEnd(false)
        unlockModal()
    }

    return (
        <View style={{ gap: 16 }}>
            <AppButton
                title={`Начало: ${new Date(startDate).toLocaleDateString()}`}
                variant='secondary'
                onPress={openStartPicker}
            />
            {showStart && (
                <DateTimePicker
                    mode='date'
                    value={new Date(startDate)}
                    onChange={(_, date) => {
                        if (date) {
                            const newStart = date.getTime()
                            const newEnd =
                                endDate && endDate < newStart
                                    ? undefined
                                    : endDate
                            onChange(newStart, newEnd)
                        }
                        closeStartPicker()
                    }}
                />
            )}

            <AppButton
                title={`Окончание: ${endDate ? new Date(endDate).toLocaleDateString() : '-'}`}
                variant='secondary'
                onPress={openEndPicker}
            />
            {showEnd && (
                <DateTimePicker
                    mode='date'
                    value={endDate ? new Date(endDate) : new Date(startDate)}
                    minimumDate={new Date(startDate)}
                    onChange={(_, date) => {
                        if (date) {
                            onChange(startDate, date.getTime())
                        }
                        closeEndPicker()
                    }}
                />
            )}
        </View>
    )
}