import React from "react";
import { View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { intakeService } from "../../../shared/intake/IntakeService";
import { notificationService } from "../../../shared/notifications/NotificationService";

type Props = NativeStackScreenProps<IntakeNavigationStack, "IntakeScreen">

export const IntakeScreen = ({ navigation, route }: Props) => {
    const { scheduleId, plannedTime } = route.params

    const schedule = useSelector((state: RootState) =>
        state.schedules.list.find(s => s.id === scheduleId)
    )

    const product = useSelector((state: RootState) =>
        state.products.list.find(p => p.id === schedule?.productId)
    )

    if (!schedule || !product) {
        return (
            <View style={{ padding: 16 }}>
                <AppText>
                    Ошибка: расписание или препарат не найдены
                </AppText>
            </View>
        )
    }
    //timestamp for planned intake
    /*const plannedFor = (() => {
        const [hh, mm] = time.split(":").map(Number)
        const date = new Date()
        date.setHours(hh)
        date.setMinutes(mm)
        date.setSeconds(0)

        return date.getTime()

    })()*/

    const handleTaken = async () => {
        await intakeService.markTaken(schedule, plannedTime)
        navigation.goBack()
    }

    const handleSkipped = async () => {
        await intakeService.markSkipped(schedule, plannedTime, 'user_skipped')
        navigation.goBack()
    }

    const handleDelayed = async () => {
        await notificationService.ScheduleSnoozed(schedule, plannedTime)
        navigation.goBack()
    }

    return (
        <View style={{ padding: 16, gap: 16 }}>
            <AppCard style={{ padding: 16 }}>
                <AppText variant='h2'>
                    {product.name}
                </AppText>
                <AppText variant='body' style={{ opacity: 0.7 }}>
                    Дозировка: {product.dosage} {product.unitType}
                </AppText>
                <AppText variant='body' style={{ opacity: 0.7 }}>
                    Время приёма: {plannedTime}
                </AppText>
            </AppCard>

            <AppButton
                title="Принято"
                variant="secondary"
                onPress={handleTaken}
            />
            <AppButton
                title="Пропущено"
                variant="primary"
                onPress={handleSkipped}
            />
            <AppButton
                title="Отложено"
                variant="secondary"
                onPress={handleDelayed}
            />
        </View>
    )
}