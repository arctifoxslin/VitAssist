import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { ScheduleDraft, RepeatType } from "../../../shared/types/Schedule";

import { ProductSelector } from "./ProductSelector";
import { TimePickerList } from "./TimePickerList";
import { RepeatSelector } from "./RepeatSelector";
import { WeeklySelector } from "./WeeklySelector";
import { DateRangePicker } from "./DateRangePicker";

interface Props {
    initialDraft?: ScheduleDraft
    onSubmit: (draft: ScheduleDraft) => void
}

export const ScheduleForm = ({ initialDraft, onSubmit }: Props) => {
    const [productId, setProductId] = useState<string | null>(null)
    const [times, setTimes] = useState<string[]>([])
    const [repeatType, setRepeatType] = useState<RepeatType>('daily')
        
    const [everyXDays, setEveryxDays] = useState<string>('2')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
    const [dayOfMonth, setDayOfMonth] = useState<string>('1')
    
    const [startDate, setStartDate] = useState(Date.now())
    const [endDate, setEndDate] = useState<number | undefined>(undefined)

    useEffect(() => {
        if(initialDraft) {
            setProductId(initialDraft.productId)
            setTimes(initialDraft.times)
            setRepeatType(initialDraft.repeatType)
            setEveryxDays(initialDraft.everyXDays?.toString() ?? "2")
            setDaysOfWeek(initialDraft.daysOfWeek ?? [])
            setDayOfMonth(initialDraft.dayOfMonth?.toString() ?? "1")
            setStartDate(initialDraft.startDate)
            setEndDate(initialDraft.endDate)
        }
    }, [initialDraft])

    const isValid = () => {
        if(!productId) {
            return false
        }
        if(times.length === 0) {
            return false
        }

        if(repeatType === 'every_x_days' && (!everyXDays || Number(everyXDays) < 1)) {
            return false
        }

        if(repeatType === 'weekly' && daysOfWeek.length === 0){
            return false
        }

        if(repeatType === 'monthly' && (
            !dayOfMonth
            || Number(dayOfMonth) < 1
            || Number(dayOfMonth) > 31
        )) {
            return false
        }

        return true
    }
    const handleSubmit = () => {
        if(!isValid() || !productId) {
            return
        }
        
        onSubmit({
            productId,
            times,
            repeatType,
            everyXDays: repeatType === 'every_x_days'
                ? Number(everyXDays)
                : undefined,
            daysOfWeek: repeatType === 'weekly'
                ? daysOfWeek
                : undefined,
            dayOfMonth: repeatType === 'monthly'
                ? Number(dayOfMonth)
                : undefined,
            startDate,
            endDate, 
        })
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
            {/*Product*/}
            <View>
                <Text variant='titleMedium'>
                    Препарат
                </Text>
                <ProductSelector value={productId} onChange={setProductId} />
            </View>
            
            {/*Invoke Time*/}
            <View>
                <Text variant='titleMedium'>
                    Время приёма
                </Text>
                <TimePickerList times={times} onChange={setTimes} />
            </View>
            
            {/*Repeat type*/}
            <View>
                <Text variant='titleMedium'>
                    Напоминание
                </Text>
                <RepeatSelector value={repeatType} onChange={setRepeatType} />
            </View>
            
            {/*Conditional on Repeat Type*/}
            {repeatType === 'every_x_days' && (
                <TextInput
                    label="Каждые N дней"
                    value={everyXDays}
                    onChangeText={setEveryxDays}
                    keyboardType='numeric'
                />
            )}
            
            {repeatType === 'weekly' && (
                <View>
                    <Text variant='titleMedium'>
                        Дни недели
                    </Text>
                    <WeeklySelector value={daysOfWeek} onChange={setDaysOfWeek} />
                </View>
            )}
            
            {repeatType === 'monthly' && (
                <TextInput
                    label="День месяца"
                    value={dayOfMonth}
                    onChangeText={setDayOfMonth}
                    keyboardType='numeric'
                />
            )}
            
            {/*Date Range*/}
            <View>
                <Text variant='titleMedium'>
                    Период
                </Text>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(start, end) => {
                        setStartDate(start)
                        setEndDate(end)
                    }}
                />
            </View>
            
            {/*Save Button*/}
            <Button
                mode='contained'
                onPress={handleSubmit}
                disabled={!isValid()}
            >
                Сохранить
            </Button>
        </ScrollView>
    )
}