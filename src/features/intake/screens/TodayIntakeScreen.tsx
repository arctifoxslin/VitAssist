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
import { getIntakeStatus } from "../../../shared/types/intakeStatus";
import { selectActiveProducts } from "../../products/productsSelectors";

type Navigation = NativeStackNavigationProp<IntakeNavigationStack>

export const TodayIntakeScreen = () => {
    const navigation = useNavigation<Navigation>()
    const schedules = useSelector((state: RootState) =>
        state.schedules.list
    )
    const products = useSelector(selectActiveProducts)
    const intakes = useSelector((state: RootState) =>
        state.intake.list
    )

    const items = getTodayIntake(schedules).sort(
        (a, b) => a.plannedFor - b.plannedFor || a.productId.localeCompare(b.productId)
    )

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            {items.length === 0 && (
                <AppText variant="title" style={{ textAlign: "center" }}>
                    На сегодня приёмов не запланированно
                </AppText>
            )}
            {items.map(item => {
                const product = products.find(p => p.id === item.productId)
                const intake = intakes.find(i => (
                    i.scheduleId === item.scheduleId &&
                    i.time === item.time &&
                    new Date(i.plannedFor).toDateString() === new Date(item.plannedFor).toDateString()
                ))

                const statusInfo = intake ? getIntakeStatus(intake.status) : null
                return (
                    <AppCard key={`${item.scheduleId} - ${item.time}`} style={{ padding: 16 }}>
                        <View style={{
                            width: 6,
                            borderRadius: 3,
                            backgroundColor: statusInfo?.color ?? "#DBDBDB"
                        }} />
                        <View style={{ flex: 1 }}>
                            <AppText variant='h2'>
                                {product?.name}
                            </AppText>
                            <AppText style={{ opacity: 0.7 }}>
                                Время: {item.time}
                            </AppText>

                            {statusInfo ? (
                                <AppText style={{
                                    marginTop: 8,
                                    color: statusInfo.color,
                                    fontWeight: "600"
                                }}>
                                    Статус приёма: {statusInfo.text}
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