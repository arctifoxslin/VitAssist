import React from "react";
import { View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { addIntake } from "../intakeSlice";
import uuid from "react-native-uuid";
import { IntakeStatus } from "../../../shared/types/Intake";
import { updateProduct } from "../../products/productsSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isCountableUnit } from "../../../shared/types/countableUnits";

type Props = NativeStackScreenProps<IntakeNavigationStack, "IntakeScreen">

export const IntakeScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch()
    const { scheduleId, time } = route.params

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

    const plannedFor = (() => {
        const [hh, mm] = time.split(":").map(Number)
        const date = new Date()
        date.setHours(hh)
        date.setMinutes(mm)
        date.setSeconds(0)

        return date.getTime()

    })()

    const handleStatus = (status: IntakeStatus) => {
        const intake = {
            id: uuid.v4().toString(),
            scheduleId,
            productId: product.id,
            time,
            plannedFor,
            createdAt: Date.now(),
            status,
        }
        dispatch(addIntake(intake))

        if (status === "taken") {
            dispatch(updateProduct({
                ...product,
                remainingUnits: isCountableUnit(product.unitType)
                    ? (product.remainingUnits ?? 0) - schedule.dosage
                    : product.remainingUnits
            }))
        }

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
                    Время приёма: {time}
                </AppText>
            </AppCard>

            <AppButton
                title="Принято"
                variant="secondary"
                onPress={() => handleStatus("taken")}
            />
            <AppButton
                title="Пропущено"
                variant="primary"
                onPress={() => handleStatus("skipped")}
            />
            <AppButton
                title="Отложено"
                variant="secondary"
                onPress={() => handleStatus("delayed")}
            />
        </View>
    )
}