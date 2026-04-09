import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
    startDate: number
    endDate?: number
    onChange: (start: number, end?: number) => void
}

export const DateRangePicker = ({ startDate, endDate, onChange }: Props) => {
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)

    return (
        <View style={{ gap: 12 }}>
            <Button
                mode='outlined'
                onPress={() => setShowStart(true)}
            >
                Начало: {new Date(startDate).toLocaleDateString()}
            </Button>
            {showStart && (
                <DateTimePicker
                    mode='date'
                    value={new Date(startDate)}
                    onChange={(_, date) => {
                        if(date) {
                            onChange(date.getTime(), endDate)
                        }
                        setShowStart(false)
                    }}
                />
            )}

            <Button
                mode='outlined'
                onPress={() => setShowEnd(true)}
            >
                Окончание: {endDate? new Date(endDate).toLocaleDateString() : '-'}
            </Button>
            {showEnd && (
                <DateTimePicker
                    mode='date'
                    value={endDate? new Date(endDate) : new Date()}
                    onChange={(_, date) => {
                        if(date) {
                            onChange(startDate, date.getTime())
                        }
                        setShowEnd(false)
                    }}
                />
            )}
        </View>
    )
}