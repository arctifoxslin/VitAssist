import React, { useState, useEffect } from "react";
import { View, ScrollView, Switch } from "react-native";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { ScheduleDraft } from "../../../shared/types/Schedule";
import { RepeatType, REPEAT_TYPE } from "../../../shared/types/repeatRype";
import { ProductSelector } from "./ProductSelector";
import { TimePickerList } from "./TimePickerList";
import { RepeatSelector } from "./RepeatSelector";
import { WeeklySelector } from "./WeeklySelector";
import { DateRangePicker } from "./DateRangePicker";
import { DropdownItem } from "../../../shared/ui/DropdownMenu";
import { RepeatReminderSelector } from "./RepeatReminderSelector";

interface Props {
    initialDraft?: ScheduleDraft
    onSubmit: (draft: ScheduleDraft) => void
    openDropdown: (
        items: DropdownItem[],
        position: { x: number, y: number }
    ) => void
    dropdownOpen: boolean
}

export const ScheduleForm = ({ initialDraft, onSubmit, openDropdown, dropdownOpen }: Props) => {
    const [productId, setProductId] = useState<string | null>(null)
    const [dosage, setDosage] = useState("1")
    const [times, setTimes] = useState<string[]>([])
    const [repeatType, setRepeatType] = useState<RepeatType>(REPEAT_TYPE.daily)

    const [everyXDays, setEveryxDays] = useState<string>('2')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
    const [dayOfMonth, setDayOfMonth] = useState<string>('1')

    const [startDate, setStartDate] = useState(Date.now())
    const [endDate, setEndDate] = useState<number | undefined>(undefined)

    const [repeatReminderEnabled, setRepeatReminderEnabled] = useState(false)
    const [repeatReminderIntervalMinutes, setRepeatReminderIntervalMinutes] = useState<number | null>(null)
    const [repeatReminderMaxCount, setRepeatReminderMaxCount] = useState<number | null>(null)

    useEffect(() => {
        if (initialDraft) {
            setProductId(initialDraft.productId)
            setDosage(initialDraft.dosage?.toString() ?? "1")
            setTimes(initialDraft.times)
            setRepeatType(initialDraft.repeatType)
            setEveryxDays(initialDraft.everyXDays?.toString() ?? "2")
            setDaysOfWeek(initialDraft.daysOfWeek ?? [])
            setDayOfMonth(initialDraft.dayOfMonth?.toString() ?? "1")
            setStartDate(initialDraft.startDate)
            setEndDate(initialDraft.endDate)
            setRepeatReminderEnabled(initialDraft.repeatReminderEnabled)
            setRepeatReminderIntervalMinutes(initialDraft.repeatReminderIntervalMinutes)
            setRepeatReminderMaxCount(initialDraft.repeatReminderMaxCount)
        }
    }, [initialDraft])

    const isValid = () => {
        if (!productId) {
            return false
        }
        if (!dosage || Number(dosage) <= 0) {
            return false
        }
        if (times.length === 0) {
            return false
        }

        if (repeatType === REPEAT_TYPE.everyXDays && (!everyXDays || Number(everyXDays) < 1)) {
            return false
        }

        if (repeatType === REPEAT_TYPE.weekly && daysOfWeek.length === 0) {
            return false
        }

        if (repeatType === REPEAT_TYPE.monthly && (
            !dayOfMonth
            || Number(dayOfMonth) < 1
            || Number(dayOfMonth) > 31
        )) {
            return false
        }

        return true
    }

    const handleSubmit = () => {
        if (!isValid() || !productId) {
            return
        }

        onSubmit({
            productId,
            dosage: Number(dosage),
            times,
            repeatType,
            everyXDays: repeatType === REPEAT_TYPE.everyXDays
                ? Number(everyXDays)
                : undefined,
            daysOfWeek: repeatType === REPEAT_TYPE.weekly
                ? daysOfWeek
                : undefined,
            dayOfMonth: repeatType === REPEAT_TYPE.monthly
                ? Number(dayOfMonth)
                : undefined,
            startDate,
            endDate,
            repeatReminderEnabled,
            repeatReminderIntervalMinutes,
            repeatReminderMaxCount,
        })
    }

    return (
        <ScrollView contentContainerStyle={{ gap: 24 }}>
            {/*Product*/}
            <View>
                <AppText variant='h2'>
                    Препарат
                </AppText>
                <ProductSelector
                    value={productId}
                    onChange={setProductId}
                    openDropdown={openDropdown}
                    dropdownOpen={dropdownOpen}
                />
            </View>

            {/*Invoke Time*/}
            <View>
                <AppText variant='h2'>
                    Время приёма
                </AppText>
                <TimePickerList times={times} onChange={setTimes} />
            </View>

            {/*Repeat type*/}
            <View>
                <AppText variant='h2'>
                    Напоминание
                </AppText>
                <RepeatSelector value={repeatType} onChange={setRepeatType} />
            </View>

            {/*Conditional on Repeat Type*/}
            {repeatType === REPEAT_TYPE.everyXDays && (
                <AppInput
                    label="Каждые N дней"
                    value={everyXDays}
                    onChangeText={setEveryxDays}
                    keyboardType='numeric'
                />
            )}

            {repeatType === REPEAT_TYPE.weekly && (
                <View>
                    <AppText variant='h2'>
                        Дни недели
                    </AppText>
                    <WeeklySelector value={daysOfWeek} onChange={setDaysOfWeek} />
                </View>
            )}

            {repeatType === REPEAT_TYPE.monthly && (
                <AppInput
                    label="День месяца"
                    value={dayOfMonth}
                    onChangeText={setDayOfMonth}
                    keyboardType='numeric'
                />
            )}


            {/*Date Range*/}
            <View>
                <AppText variant='h2'>
                    Период
                </AppText>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(start, end) => {
                        setStartDate(start)
                        setEndDate(end)
                    }}
                />
            </View>

            {/*Repeat Reminders*/}
            <RepeatReminderSelector
                enable={repeatReminderEnabled}
                onEnableChange={setRepeatReminderEnabled}
                interval={repeatReminderIntervalMinutes}
                onIntervalChange={setRepeatReminderIntervalMinutes}
                maxCount={repeatReminderMaxCount}
                onMaxCountChange={setRepeatReminderMaxCount}
            />

            {/*Set Dose*/}
            <View>
                <AppText variant='h2'>
                    Разовая дозировка
                </AppText>
                <AppInput
                    label="Количество единиц"
                    value={dosage}
                    onChangeText={setDosage}
                    keyboardType="numeric"
                />
            </View>

            {/*Save Button*/}
            <AppButton
                title="Сохранить"
                variant='primary'
                onPress={handleSubmit}
                disabled={!isValid()}
            />
        </ScrollView>
    )
}