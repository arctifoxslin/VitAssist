import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { ScheduleDraft, RepeatType } from "../../../shared/types/Schedule";
import { ProductSelector } from "./ProductSelector";
import { TimePickerList } from "./TimePickerList";
import { RepeatSelector } from "./RepeatSelector";
import { WeeklySelector } from "./WeeklySelector";
import { DateRangePicker } from "./DateRangePicker";
import { DropdownMenu, DropdownItem } from "../../../shared/ui/DropdownMenu";

interface Props {
    initialDraft?: ScheduleDraft
    onSubmit: (draft: ScheduleDraft) => void
}

export const ScheduleForm = ({ initialDraft, onSubmit }: Props) => {
    const [productId, setProductId] = useState<string | null>(null)
    const [dose, setDose] = useState<string>("1")
    const [times, setTimes] = useState<string[]>([])
    const [repeatType, setRepeatType] = useState<RepeatType>('daily')

    const [everyXDays, setEveryxDays] = useState<string>('2')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
    const [dayOfMonth, setDayOfMonth] = useState<string>('1')

    const [startDate, setStartDate] = useState(Date.now())
    const [endDate, setEndDate] = useState<number | undefined>(undefined)

    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownItem, setDropdownItem] = useState<DropdownItem[]>([])
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })

    const openDropdown = (
        items: DropdownItem[],
        position: { x: number, y: number }
    ) => {
        setDropdownItem(items)
        setDropdownPosition(position)
        setDropdownVisible(true)
    }

    const closeDropdown = () => {
        setDropdownVisible(false)
    }

    useEffect(() => {
        if (initialDraft) {
            setProductId(initialDraft.productId)
            setDose(initialDraft.dose?.toString() ?? "1")
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
        if (!productId) {
            return false
        }
        if (!dose || Number(dose) <= 0) {
            return false
        }
        if (times.length === 0) {
            return false
        }

        if (repeatType === 'every_x_days' && (!everyXDays || Number(everyXDays) < 1)) {
            return false
        }

        if (repeatType === 'weekly' && daysOfWeek.length === 0) {
            return false
        }

        if (repeatType === 'monthly' && (
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
            dose: Number(dose),
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
        <>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
                {/*Product*/}
                <View>
                    <AppText variant='h2'>
                        Препарат
                    </AppText>
                    <ProductSelector
                        value={productId}
                        onChange={setProductId}
                        openDropdown={openDropdown}
                        dropdownOpen={dropdownVisible}
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
                {repeatType === 'every_x_days' && (
                    <AppInput
                        label="Каждые N дней"
                        value={everyXDays}
                        onChangeText={setEveryxDays}
                        keyboardType='numeric'
                    />
                )}

                {repeatType === 'weekly' && (
                    <View>
                        <AppText variant='h2'>
                            Дни недели
                        </AppText>
                        <WeeklySelector value={daysOfWeek} onChange={setDaysOfWeek} />
                    </View>
                )}

                {repeatType === 'monthly' && (
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

                {/*Set Dose*/}
                <View>
                    <AppText variant='h2'>
                        Разовая дозировка
                    </AppText>
                    <AppInput
                        label="Количество единиц"
                        value={dose}
                        onChangeText={setDose}
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

            {/*Dropdown Menu*/}
            <DropdownMenu
                visible={dropdownVisible}
                items={dropdownItem}
                position={dropdownPosition}
                onClose={closeDropdown}
            />
        </>
    )
}