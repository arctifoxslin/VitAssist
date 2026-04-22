import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { getYearsFromSchedule } from "../utils/getYearsFromSchedule";
import { getMonthsFromSchecule } from "../utils/getMonthsFromSchedule";
import { ScheduleCard } from "../components/ScheduleCard";
import { intakeService } from "../../../shared/intake/IntakeService";

export const HistoryScreen = () => {
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
        <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
            <AppText variant='h3'>
                История
            </AppText>

            {/*FILTERS --- Year | Product*/}
            <AppCard style={{ padding: 12, gap: 12 }}>
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
                        <AppButton
                            title={String(y)}
                            key={y}
                            variant={y === selectedYear ? "primary" : "secondary"}
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
                    <AppButton
                        title="Все препараты"
                        variant={!selectedProductId ? "primary" : "secondary"}
                        onPress={() => setSelectedProductId(null)}
                    >

                    </AppButton>

                    {products.map(p => (
                        <AppButton
                            title={p.name}
                            key={p.id}
                            variant={selectedProductId === p.id ? "primary" : "secondary"}
                            onPress={() => setSelectedProductId(p.id)}
                        />
                    ))}
                </View>
            </AppCard>

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
        </ScrollView>
    )
}