import React, { useState } from "react";
import { View, Switch } from "react-native";
import { AppText } from "../../../shared/ui/AppText";
import { AppInput } from "../../../shared/ui/AppInput";
import { AppSelect } from "../../../shared/ui/AppSelect";

interface Props {
    enable: boolean
    onEnableChange: (v: boolean) => void
    interval: number | null
    onIntervalChange: (v: number | null) => void
    maxCount: number | null
    onMaxCountChange: (v: number | null) => void
}

export const RepeatReminderSelector = ({
    enable,
    onEnableChange,
    interval,
    onIntervalChange,
    maxCount,
    onMaxCountChange,
}: Props) => {
    const [intervalMode, setIntervalMode] = useState<"preset" | "custom">(
        interval === null ? "custom" : "preset"
    )
    const [countMode, setCountMode] = useState<"preset" | "custom">(
        maxCount === null ? "custom" : "preset"
    )
    const intervalOptions = [
        { label: "1 час", value: 60 },
        { label: "2 часа", value: 120 },
        { label: "4 часа", value: 240 },
        { label: "своё значение", value: "custom" },
    ]

    const countOptions = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "бесконечно", value: "infinite" },
        { label: "своё значение", value: "custom" },
    ]

    const validateInterval = (value: number | null) => {
        if (value === null) return true
        return value >= 5 && value <= 480
    }

    return (
        <View style={{ gap: 12 }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <AppText variant="body" style={{ flex: 1 }}>
                    Включить повторные напоминания
                </AppText>
                <Switch value={enable} onValueChange={onEnableChange} />
            </View>

            {enable && (
                <>
                    <AppSelect
                        label="Интервал между напоминаниями"
                        value={intervalMode === "custom" ? "custom" : interval}
                        options={intervalOptions}
                        onChange={(v) => {
                            if (v === "custom") {
                                setIntervalMode("custom")
                                onIntervalChange(null)
                            } else {
                                setIntervalMode("preset")
                                onIntervalChange(v as number)
                            }
                        }}
                    />

                    {intervalMode === "custom" && (
                        <>
                            <AppText variant="small">
                                Повторные напоминания создаются только в пределах текущего дня.
                                Если интервал слишком большой, часть напоминаний может быть пропущена.
                            </AppText>
                            <AppInput
                                label="Свой интервал (минуты)"
                                value={interval?.toString() ?? ""}
                                onChangeText={(v) => {
                                    const num = v ? Number(v) : null
                                    if (num === null || validateInterval(num)) {
                                        onIntervalChange(num)
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            {interval !== null && !validateInterval(interval) && (
                                <AppText variant="small" style={{ color: "red" }}>
                                    Интервал должен быть от 5 до 480 минут
                                </AppText>
                            )}
                        </>
                    )}

                    <AppSelect
                        label="Максимальное количество повторов"
                        placeholder="бесконечно"
                        value={countMode === "custom"
                            ? "custom"
                            : maxCount === null
                                ? "infinite"
                                : maxCount}
                        options={countOptions}
                        onChange={(v) => {
                            if (v === "custom") {
                                setCountMode("custom")
                                onMaxCountChange(null)
                            } else if (v === "infinite") {
                                setCountMode("preset")
                                onMaxCountChange(null)
                            }
                            else {
                                setCountMode("preset")
                                onMaxCountChange(v as number)
                            }
                        }}
                    />

                    {countMode === "custom" && (
                        <AppInput
                            label="Количество повторов"
                            value={maxCount?.toString() ?? ""}
                            onChangeText={
                                (v) => onMaxCountChange(v ? Number(v) : null)
                            }
                            keyboardType="numeric"
                        />
                    )}
                </>
            )}
        </View>
    )
}