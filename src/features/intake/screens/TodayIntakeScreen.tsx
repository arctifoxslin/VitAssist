import React from "react";
import { ScrollView, View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { getTodayIntake } from "../utils/getTodayIntake";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { formatTimeDiff } from "../utils/formatTimeDiff";
import { getIntakeStatusColor } from "../constants/statusColor";

type Navigation = NativeStackNavigationProp<IntakeNavigationStack>

export const TodayIntakeScreen = () => {
    const navigation = useNavigation<Navigation>()
    const schedules = useSelector((state: RootState) =>
        state.schedules.list
    )
    const products = useSelector((state: RootState) =>
        state.products.list
    )
    const intakes = useSelector((state: RootState) =>
        state.intake.list
    )

    const items = getTodayIntake(schedules).sort(
        (a, b) => a.plannedFor - b.plannedFor || a.productId.localeCompare(b.productId)
    )

    const nextIntake = items.find(i => i.plannedFor > Date.now())
    const nextIntakeProduct = nextIntake
        ? products.find(p => p.id === nextIntake.productId)
        : null
    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <AppText variant='h3'>
                Сегодня
            </AppText>

            {nextIntake && (
                <AppCard style={{ padding: 16, backgroundColor: "#eef6ff" }}>
                    <AppText variant='h2'>
                        Следующий приём
                    </AppText>
                    <AppText variant='body' style={{ fontWeight: "600" }}>
                        {nextIntakeProduct?.name ?? "Неизвестный препарат"}
                    </AppText>
                    <AppText style={{ opacity: 0.7 }}>
                        {formatTimeDiff(nextIntake.plannedFor)}
                    </AppText>
                </AppCard>
            )}

            {items.map(item => {
                const product = products.find(p => p.id === item.productId)
                const intake = intakes.find(i => (
                    i.scheduleId === item.scheduleId &&
                    i.time === item.time &&
                    new Date(i.plannedFor).toDateString() === new Date(item.plannedFor).toDateString()
                ))
                return (
                    <AppCard key={`${item.scheduleId} - ${item.time}`} style={{ padding: 16 }}>
                        <View style={{
                            width: 6,
                            borderRadius: 3,
                            backgroundColor: intake
                                ? getIntakeStatusColor(intake.status)
                                : "#DBDBDB"
                        }} />
                        <View style={{ flex: 1 }}>
                            <AppText variant='h2'>
                                {product?.name}
                            </AppText>
                            <AppText style={{ opacity: 0.7 }}>
                                Время: {item.time}
                            </AppText>

                            {intake ? (
                                <AppText style={{
                                    marginTop: 8,
                                    color: getIntakeStatusColor(intake.status),
                                    fontWeight: "600"
                                }}>
                                    Статус приёма: {
                                        intake.status === "taken" ? "Принято"
                                            : intake.status === "delayed" ? "Отложено"
                                                : "Пропущено"
                                    }
                                </AppText>
                            ) : (
                                <AppButton
                                    title="Отметить приём"
                                    variant="primary"
                                    onPress={() => navigation.navigate(
                                        "IntakeScreen",
                                        {
                                            scheduleId: item.scheduleId,
                                            time: item.time,
                                        }
                                    )}
                                />
                            )}
                        </View>
                    </AppCard>
                )
            })}
        </ScrollView>
    )
}