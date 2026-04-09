import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addSchedule, updateSchedule, removeSchedule } from "../schedulesSlice";
import { Schedule, ScheduleDraft } from "../../../shared/types/Schedule";
import uuid from "react-native-uuid";
import { ScheduleForm } from "../components/ScheduleFrom";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "../SchedulesNavigationStack";
import { RootState } from "../../../app/store/store";

type Props = NativeStackScreenProps<SchedulesNavigationStack, 'AddSchedule'>


export const AddScheduleScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch()

    const editId = route.params?.id
    const existSchedule = useSelector((state: RootState) =>
        state.schedules.list.find((s) => s.id === editId)
    )

    const initialDraft: ScheduleDraft | undefined = existSchedule ? {
        productId: existSchedule.productId,
        times: existSchedule.times,
        repeatType: existSchedule.repeatType,
        everyXDays: existSchedule.everyXDays,
        daysOfWeek: existSchedule.daysOfWeek,
        dayOfMonth: existSchedule.dayOfMonth,
        startDate: existSchedule.startDate,
        endDate: existSchedule.endDate,
    } : undefined

    const handleSubmit = (draft: ScheduleDraft) => {
        const schedule: Schedule = {
            ...draft,
            id: editId ?? uuid.v4().toString(),
            createdAt: existSchedule?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        }

        if(existSchedule){
            dispatch(updateSchedule(schedule))
        } else {
            dispatch(addSchedule(schedule))
        }

        navigation.goBack()
    }

    const handleDelete = () => {
        if(!editId){
            return
        }
        dispatch(removeSchedule(editId))
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1 }}>
            <ScheduleForm initialDraft={initialDraft} onSubmit={handleSubmit} />

            {editId && (
                <Button
                    mode='contained-tonal'
                    onPress={handleDelete}
                    style={{ marginTop: 16 }}
                >
                    Удалить расписание
                </Button>
            )}
        </View>
    )
}