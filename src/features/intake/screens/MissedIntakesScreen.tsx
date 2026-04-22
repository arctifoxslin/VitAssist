import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { intakeService } from "../../../shared/intake/IntakeService";
import { intakeRepository } from "../../../shared/intake/IntakeRepository";
import { Intake } from "../../../shared/types/Intake";
import { ScrollView, View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppCard } from "../../../shared/ui/AppCard";
import { AppButton } from "../../../shared/ui/AppButton";

type Props = NativeStackScreenProps<IntakeNavigationStack, "MissedIntakesScreen">

export const MissedIntakesScreen = ({ navigation, route }: Props) => {
    const { scheduleId } = route.params
    const [missed, setMissed] = useState<Intake[]>([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        const all = await intakeRepository.findBySchedule(scheduleId)
        const filtered = all
            .filter(i => i.status === "skipped")
            .sort((a, b) => a.plannedFor - b.plannedFor)
        setMissed(filtered)
    }

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

    return (
        <>
            <AppButton
                title="Назад"
                onPress={navigation.goBack}
                icon="chevron-left"
                variant="secondary"
            />
            <ScrollView style={{ padding: 16 }}>
                {missed.length === 0 && (
                    <AppText variant="h3">
                        Нет пропущенных приёмов
                    </AppText>
                )}
                {missed.map((i) => (
                    <View key={i.id}>
                        <AppCard style={{
                            padding: 16,
                            gap: 12,
                            borderRadius: 12,
                            backgroundColor: "white",
                            elevation: 2,
                            flexDirection: 'row'
                        }}>
                            <AppText variant="h2">
                                {new Date(i.plannedFor).toLocaleString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </AppText>
                            <AppButton
                                title="Принято"
                                variant="primary"
                                onPress={() => markAsTaken(i)}
                            />
                        </AppCard>
                    </View>

                ))}
            </ScrollView>
        </>
    )
}