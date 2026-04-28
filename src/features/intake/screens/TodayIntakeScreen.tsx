import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { getIntakeStatus } from "../../../shared/types/intakeStatus";
import { selectActiveProducts } from "../../products/productsSelectors";
import { getTodayIntake } from "../utils/getTodayIntake";
import { intakeService } from "../../../shared/intake/IntakeService";
import { Intake } from "../../../shared/types/Intake";
import { AppScreen } from "../../../shared/ui/AppScreen";

type Navigation = NativeStackNavigationProp<IntakeNavigationStack>

export const TodayIntakeScreen = () => {
    const navigation = useNavigation<Navigation>()

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Приёмы на сегодня"
        })
    }, [navigation])

    const schedules = useSelector((state: RootState) =>
        state.schedules.list
    )
    const products = useSelector(selectActiveProducts)

    const [todayIntakes, setTodayIntakes] = useState<Intake[]>([])

    const load = async () => {
        const list = await intakeService.getIntakesForDay(Date.now())
        setTodayIntakes(list)
    }

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", load)
        return unsubscribe
    }, [navigation])

    const plannedItems = getTodayIntake(schedules).sort(
        (a, b) => a.plannedFor - b.plannedFor || a.productId.localeCompare(b.productId)
    )

    const visibleItems = plannedItems.filter(item => {
        const intake = todayIntakes.find(i =>
            i.scheduleId === item.scheduleId &&
            i.plannedFor === item.plannedFor
        )
        if (!intake) return true
        return intake/*.status !== "taken" && intake.status !== "skipped"*/
    })

    return (
        <AppScreen>
            {visibleItems.length === 0 && (
                <AppText variant="title" style={{ textAlign: "center" }}>
                    На сегодня приёмов нет
                </AppText>
            )}
            <FlatList
                data={visibleItems}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                keyExtractor={(item) => `${item.scheduleId}-${item.plannedFor}`}
                renderItem={({ item }) => {
                    const product = products.find(p => p.id === item.productId)
                    const intake = todayIntakes.find(i => (
                        i.scheduleId === item.scheduleId &&
                        i.plannedFor === item.plannedFor
                    ))
                    const statusInfo = intake ? getIntakeStatus(intake.status) : null
                    return (
                        <AppCard row>
                            <View style={{ flex: 1, flexShrink: 1 }}>
                                <AppText variant='h2'>
                                    {product?.name}
                                </AppText>
                                <AppText variant="body">
                                    Время: {item.time}
                                </AppText>
                            </View>
                            {statusInfo ? (
                                <View style={{ flex: 1, flexShrink: 1 }}>
                                    <AppText style={{
                                        marginTop: 8,
                                        color: statusInfo.color,
                                        fontWeight: "600"
                                    }}>
                                        Статус приёма: {statusInfo.text}
                                    </AppText>
                                </View>
                            ) : (
                                <View style={{ flex: 1, flexShrink: 1 }}>
                                    <AppButton
                                        title="Отметить приём"
                                        variant="primary"
                                        onPress={() =>
                                            navigation.navigate("IntakeScreen", {
                                                scheduleId: item.scheduleId,
                                                plannedTime: item.plannedFor,
                                            }
                                            )}
                                    />
                                </View>
                            )}
                        </AppCard>
                    )
                }}
            />
        </AppScreen>
    )
}