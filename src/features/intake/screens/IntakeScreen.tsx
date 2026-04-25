import React, { useLayoutEffect } from "react";
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
import { formatTimeFromTimestamp } from "../../../shared/utils/formatTimeFromTimestamp";
import { UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Props = NativeStackScreenProps<IntakeNavigationStack, "IntakeScreen">

export const IntakeScreen = ({ navigation, route }: Props) => {
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Отметить приём"
        })
    }, [])

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
    const intakeTime = formatTimeFromTimestamp(plannedTime)
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
        await notificationService.scheduleSnoozed(schedule, plannedTime)
        navigation.goBack()
    }

    return (
        <AppScreen style={{ padding: 16, gap: 12 }}>
            <AppCard>
                <AppText variant='h2'>
                    {product.name}
                </AppText>
                <AppText variant='body'>
                    Дозировка: {schedule.dosage} {UNIT_TYPE_LABELS[product.unitType]}
                </AppText>
                <AppText variant='body'>
                    Время приёма: {intakeTime}
                </AppText>
            </AppCard>

            <AppButton
                title="Принято"
                variant="primary"
                onPress={handleTaken}
            />
            <AppButton
                title="Пропущено"
                variant="danger"
                onPress={handleSkipped}
            />
            <AppButton
                title="Отложено"
                variant="secondary"
                onPress={handleDelayed}
            />
        </AppScreen>
    )
}