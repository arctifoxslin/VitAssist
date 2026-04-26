import React, { useLayoutEffect, useState } from "react";
import { AppButton } from "../../../shared/ui/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { updateScheduleThunk, createScheduleThunk, removeScheduleThunk } from "../schedulesSlice";
import { Schedule, ScheduleDraft } from "../../../shared/types/Schedule";
import uuid from "react-native-uuid";
import { ScheduleForm } from "../components/ScheduleFrom";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";
import { AppDispatch, RootState } from "../../../app/store/store";
import { DropdownMenu, DropdownItem } from "../../../shared/ui/DropdownMenu";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Props = NativeStackScreenProps<SchedulesNavigationStack, 'AddSchedule'>


export const AddScheduleScreen = ({ navigation, route }: Props) => {
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Новое расписание"
        })
    }, [navigation])
    const dispatch = useDispatch<AppDispatch>()

    const editId = route.params?.id
    const existSchedule = useSelector((state: RootState) =>
        state.schedules.list.find((s) => s.id === editId)
    )

    const initialDraft: ScheduleDraft | undefined = existSchedule ? {
        productId: existSchedule.productId,
        dosage: existSchedule.dosage,
        times: existSchedule.times,
        repeatType: existSchedule.repeatType,
        everyXDays: existSchedule.everyXDays,
        daysOfWeek: existSchedule.daysOfWeek,
        dayOfMonth: existSchedule.dayOfMonth,
        startDate: existSchedule.startDate,
        endDate: existSchedule.endDate,
        repeatReminderEnabled: existSchedule.repeatReminderEnabled,
        repeatReminderIntervalMinutes: existSchedule.repeatReminderIntervalMinutes,
        repeatReminderMaxCount: existSchedule.repeatReminderMaxCount,
    } : undefined

    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([])
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })

    const openDropdown = (
        items: DropdownItem[],
        position: { x: number, y: number }
    ) => {
        setDropdownItems(items)
        setDropdownPosition(position)
        setDropdownVisible(true)
    }

    const closeDropdown = () => {
        setDropdownVisible(false)
    }

    const handleSubmit = async (draft: ScheduleDraft) => {
        const schedule: Schedule = {
            ...draft,
            id: editId ?? uuid.v4().toString(),
            createdAt: existSchedule?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }

        if (existSchedule) {
            dispatch(updateScheduleThunk(schedule))
        } else {
            dispatch(createScheduleThunk(schedule))
        }

        navigation.goBack()
    }

    const handleDelete = async () => {
        if (!editId) {
            return
        }
        dispatch(removeScheduleThunk(editId))
        navigation.goBack()
    }

    return (
        <>
            <AppScreen scroll>
                <ScheduleForm
                    initialDraft={initialDraft}
                    onSubmit={handleSubmit}
                    openDropdown={openDropdown}
                    dropdownOpen={dropdownVisible}
                />
                {editId && (
                    <AppButton
                        title="Удалить расписание"
                        variant='danger'
                        onPress={handleDelete}
                    />
                )}
            </AppScreen>

            <DropdownMenu
                visible={dropdownVisible}
                items={dropdownItems}
                position={dropdownPosition}
                onClose={closeDropdown}
            />
        </>
    )
}