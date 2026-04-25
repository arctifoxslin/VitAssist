import React, { useState, useMemo, useEffect, useCallback, useLayoutEffect } from "react";
import { View } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { getYearsFromSchedule } from "../utils/getYearsFromSchedule";
import { getMonthsFromSchecule } from "../utils/getMonthsFromSchedule";
import { ScheduleCard } from "../components/ScheduleCard";
import { intakeService } from "../../../shared/intake/IntakeService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { AppScreen } from "../../../shared/ui/AppScreen";
import { AppChip } from "../../../shared/ui/AppChip";

type Navigation = NativeStackNavigationProp<IntakeNavigationStack>

export const HistoryScreen = () => {
    const navigation = useNavigation<Navigation>()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "История приёмов"
        })
    }, [])

    const schedules = useSelector((state: RootState) =>
        state.schedules.list
    )
    const products = useSelector((state: RootState) =>
        state.products.list
    )

    const [historyMap, setHistoryMap] = useState<Record<string, any[]>>({})

    useEffect(
        useCallback(() => {
            const load = async () => {
                const map: Record<string, any[]> = {}

                for (const s of schedules) {
                    const list = await intakeService.getHistory(s.id)
                    map[s.id] = list
                }
                setHistoryMap(map)
            }
            load()

        }, [])
    )

    // Screen filters
    const years = getYearsFromSchedule(schedules)
    const [selectedYear, setSelectedYear] = useState(years[0] ?? null)
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

    const filteredSchedules = useMemo(() => {
        return schedules.filter(s => {
            const startYear = new Date(s.startDate).getFullYear()
            const endYear = s.endDate
                ? new Date(s.endDate).getFullYear
                : startYear

            const matchYear = selectedYear
                ? startYear === selectedYear || endYear === selectedYear
                : true

            const matchProduct = selectedProductId
                ? s.productId === selectedProductId
                : true

            return matchYear && matchProduct
        })
    }, [schedules, selectedYear, selectedProductId])

    const months = selectedYear
        ? getMonthsFromSchecule(filteredSchedules, selectedYear)
        : []

    return (
        <AppScreen scroll>

            {/*FILTERS --- Year | Product*/}
            <View style={{ gap: 16 }}>
                <AppText variant='h3'>
                    Фильтры
                </AppText>

                {/*Filter by Year*/}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8
                }}>
                    {years.map(y => (
                        <AppChip
                            key={y}
                            label={String(y)}
                            selected={y === selectedYear}
                            onPress={() => setSelectedYear(y)}
                        />
                    ))}
                </View>

                {/*Filter by Product*/}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8
                }}>
                    <AppChip
                        label="Все препараты"
                        selected={!selectedProductId}
                        onPress={() => setSelectedProductId(null)}
                    />
                    {products.map(p => (
                        <AppChip
                            key={p.id}
                            label={p.name}
                            selected={selectedProductId === p.id}
                            onPress={() => setSelectedProductId(p.id)}
                        />
                    ))}
                </View>
            </View>

            {/*Group by Month*/}
            {months.map(month => {
                const monthSchedules = filteredSchedules.filter(s => {
                    const start = new Date(s.startDate)
                    const end = s.endDate ? new Date(s.endDate) : start

                    return (
                        (start.getFullYear() === selectedYear &&
                            start.getMonth() === month) ||
                        (end.getFullYear() === selectedYear &&
                            end.getMonth() === month)
                    )
                })

                const monthLabel = new Date(selectedYear, month).toLocaleDateString(
                    "ru-RU",
                    { month: "long" }
                )

                return (
                    <View key={month} style={{ gap: 16 }}>
                        <AppText variant='h2' style={{ textTransform: "capitalize" }}>
                            {monthLabel}
                        </AppText>

                        {monthSchedules.map(s => {
                            const product = products.find(p => p.id === s.productId)
                            const scheduleIntakes = historyMap[s.id] ?? []
                            if (!product) {
                                return null
                            }
                            return (
                                <ScheduleCard
                                    key={s.id}
                                    schedule={s}
                                    product={product}
                                    intakes={scheduleIntakes}
                                />
                            )
                        })}
                    </View>
                )
            })}
        </AppScreen>
    )
}