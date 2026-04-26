import React, { useEffect, useLayoutEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { intakeService } from "../../../shared/intake/IntakeService";
import { intakeRepository } from "../../../shared/intake/IntakeRepository";
import { Intake } from "../../../shared/types/Intake";
import { FlatList } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppCard } from "../../../shared/ui/AppCard";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Props = NativeStackScreenProps<IntakeNavigationStack, "MissedIntakesScreen">

export const MissedIntakesScreen = ({ navigation, route }: Props) => {
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Пропущенные приёмы"
        })
    }, [navigation])

    const { scheduleId } = route.params
    const [missed, setMissed] = useState<Intake[]>([])

    const load = async () => {
        const all = await intakeRepository.findBySchedule(scheduleId)
        const filtered = all
            .filter(i => i.status === "skipped")
            .sort((a, b) => a.plannedFor - b.plannedFor)
        setMissed(filtered)
    }

    useEffect(() => {
        load()
    }, [load])

    const markAsTaken = async (intake: Intake) => {
        await intakeService.updateIntakeStatus(
            intake.scheduleId,
            intake.plannedFor,
            "taken",
            Date.now(),
            null
        )
        load()
    }

    if (missed.length === 0) {
        return (
            <AppText variant="h3">
                Нет пропущенных приёмов
            </AppText>
        )
    }

    return (
        <AppScreen>
            <FlatList
                data={missed}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                keyExtractor={(item) => `${item.scheduleId}-${item.plannedFor}`}
                renderItem={({ item }) => (
                    <AppCard row={true}>
                        <AppText variant="h3">
                            {new Date(item.plannedFor).toLocaleString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </AppText>
                        <AppButton
                            title="Принято"
                            variant="primary"
                            onPress={() => markAsTaken(item)}
                        />
                    </AppCard>
                )}
            />
        </AppScreen>
    )
}