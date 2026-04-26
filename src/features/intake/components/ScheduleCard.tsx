import React, { useState } from "react";
import { Schedule } from "../../../shared/types/Schedule";
import { Product } from "../../../shared/types/Product";
import { Intake } from "../../../shared/types/Intake";
import { View, ScrollView } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppCard } from "../../../shared/ui/AppCard";
import { buildScheduleMatrix } from "../utils/buildScheduleMatrix";
import { getIntakeStatus, INTAKE_STATUS } from "../../../shared/types/intakeStatus";
import { useNavigation } from "@react-navigation/native";
import { IntakeNavigationStack } from "../IntakeNavigationStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Navigation = NativeStackNavigationProp<IntakeNavigationStack, "HistoryScreen">

type Props = {
    schedule: Schedule
    product: Product
    intakes: Intake[]
}

export const ScheduleCard = ({ schedule, product, intakes }: Props) => {
    const navigation = useNavigation<Navigation>()
    const [expanded, setExpanded] = useState(false)
    const hasMissed = intakes.some(i => i.status === "skipped")

    const matrix = buildScheduleMatrix(schedule, intakes)

    const formatDay = (day: Date) =>
        day.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })

    const formatDateRange = () => {
        const start = new Date(schedule.startDate).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })

        const end = schedule.endDate
            ? new Date(schedule.endDate).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) : "-"

        return `${start} - ${end}`
    }

    const getCell = (day: Date, time: string) => {
        const dayKey = day.toDateString()
        return matrix.cells[dayKey]?.[time]
    }

    const renderStatusIcon = (status?: Intake["status"]) => {
        const info = getIntakeStatus(status)
        if (!info) {
            return (
                <View style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "transparent",
                }} />
            )
        }

        return (
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <AppText style={{ color: info.color, fontSize: 12 }}>
                    {info.icon}
                </AppText>
            </View>
        )
    }

    return (
        <AppCard style={{
            padding: 16,
            gap: 12,
            borderRadius: 12,
            backgroundColor: "white",
            elevation: 2
        }}>
            {/*HEADER*/}
            <AppText variant='h2'>
                {product.name}
            </AppText>
            <AppText variant='body' style={{ opacity: 0.7 }}>
                Курс: {formatDateRange()}
            </AppText>

            {/*TABLE TOGGLE*/}
            <AppButton
                title={expanded ? "Свернуть" : "Показать таблицу"}
                onPress={() => setExpanded(!expanded)}
            />
            {/*TABLE LEGEND*/}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginTop: 12,
                flexWrap: "wrap",
            }}>
                {Object.entries(INTAKE_STATUS).map(([key, info]) => (
                    <View
                        key={key}
                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                    >
                        <View style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: info.color,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <AppText style={{ color: "white", fontSize: 10 }}>
                                {info.icon}
                            </AppText>
                        </View>

                        <AppText variant="small" style={{ opacity: 0.8 }}>
                            {info.text}
                        </AppText>
                    </View>
                ))}
            </View>
            {/*MATRIX*/}
            {expanded && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        {/*TIME COLUMN*/}
                        <View style={{
                            marginRight: 8,
                            borderRightWidth: 1,
                            borderColor: "#e0e0e0",
                            paddingRight: 8,
                        }}>
                            <View style={{ height: 36 }} />
                            {matrix.times.map(time => (
                                <View key={time} style={{
                                    height: 40,
                                    justifyContent: 'center',
                                }}>
                                    <AppText variant='small' style={{ opacity: 0.7 }}>
                                        {time}
                                    </AppText>
                                </View>
                            ))}
                        </View>

                        {/*DAY COLUMNS*/}
                        {matrix.days.map((day, index) => {
                            const dayKey = day.toDateString()
                            const isEven = index % 2 === 0
                            return (

                                <View key={dayKey} style={{
                                    marginRight: 6,
                                    backgroundColor: isEven ? "#fafafa" : "#fff",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.05,
                                    shadowRadius: 3,
                                    elevation: 1,
                                }}>
                                    {/*DAY HEADERS*/}
                                    <View style={{
                                        height: 36,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: "#f3f3f3",
                                        borderBottomWidth: 1,
                                        borderColor: '#e0e0e0',
                                    }}>
                                        <AppText variant='small'>
                                            {formatDay(day)}
                                        </AppText>
                                    </View>

                                    {/*CELLS*/}
                                    {matrix.times.map(time => {
                                        const cell = getCell(day, time)

                                        return (
                                            <View key={time} style={{
                                                height: 40,
                                                width: 40,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderColor: "#eaeaea",
                                            }}>
                                                {renderStatusIcon(cell?.status)}
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            )}
            {/*EDIT INTAKES*/}
            {hasMissed && (
                <AppButton
                    title="Редактировать"
                    onPress={() => navigation.navigate("MissedIntakesScreen", {
                        scheduleId: schedule.id,
                    })}
                />
            )}
        </AppCard>
    )
}