import React from "react";
import { View } from "react-native";
import { AppButton } from "../../../shared/ui/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { addSchedule, updateSchedule, removeSchedule } from "../schedulesSlice";
import { Schedule, ScheduleDraft } from "../../../shared/types/Schedule";
import uuid from "react-native-uuid";
import { ScheduleForm } from "../components/ScheduleFrom";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";
import { RootState } from "../../../app/store/store";
import { notificationService } from "../../notifications/NotificationService";

type Props = NativeStackScreenProps<SchedulesNavigationStack, 'AddSchedule'>


export const AddScheduleScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch()

    const editId = route.params?.id
    const existSchedule = useSelector((state: RootState) =>
        state.schedules.list.find((s) => s.id === editId)
    )

    const initialDraft: ScheduleDraft | undefined = existSchedule ? {
        productId: existSchedule.productId,
        dose: existSchedule.dose,
        times: existSchedule.times,
        repeatType: existSchedule.repeatType,
        everyXDays: existSchedule.everyXDays,
        daysOfWeek: existSchedule.daysOfWeek,
        dayOfMonth: existSchedule.dayOfMonth,
        startDate: existSchedule.startDate,
        endDate: existSchedule.endDate,
    } : undefined

    const handleSubmit = async (draft: ScheduleDraft) => {
        const schedule: Schedule = {
            ...draft,
            id: editId ?? uuid.v4().toString(),
            createdAt: existSchedule?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }

        if (existSchedule) {
            dispatch(updateSchedule(schedule))
            await notificationService.updateScheduleNotifications(schedule)
        } else {
            dispatch(addSchedule(schedule))
            await notificationService.scheduleNotification(schedule)
        }

        navigation.goBack()
    }

    const handleDelete = async () => {
        if (!editId) {
            return
        }
        dispatch(removeSchedule(editId))
        await notificationService.cancelScheduleNotifications(editId)
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1 }}>
            <ScheduleForm initialDraft={initialDraft} onSubmit={handleSubmit} />

            {editId && (
                <AppButton
                    title="Удалить расписание"
                    variant='primary'
                    onPress={handleDelete}
                />
            )}
        </View>
    )
}