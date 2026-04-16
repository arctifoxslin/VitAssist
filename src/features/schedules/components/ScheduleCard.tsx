import React from "react";
import { AppCard } from "../../../shared/ui/AppCard";
import { Schedule } from "../../../shared/types/Schedule";
import { useSelector } from "react-redux";
import { selectActiveProducts } from "../../products/productsSelectors";
import { AppText } from "../../../shared/ui/AppText";
import { View, Pressable } from "react-native";
import { UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { formatTimeDiff } from "../../intake/utils/formatTimeDiff";
import { getNextIntake } from "../utils/getNextIntake";

interface Props {
    schedule: Schedule
    onPress?: () => void
}

export const ScheduleCard = ({ schedule, onPress }: Props) => {
    const products = useSelector(selectActiveProducts)
    const selected = products.find(p => p.id === schedule.productId)
    const nextIntake = getNextIntake(schedule)

    return (
        <Pressable onPress={onPress}>
            <AppCard style={{ marginBottom: 12, gap: 12 }}>
                <View>
                    <AppText variant="title">
                        {selected?.name ?? 'Неизвестный препарат'}
                    </AppText>
                    <AppText variant="subtitle" color="#666">
                        {schedule.times.join(', ')}
                    </AppText>
                    <AppText variant="subtitle">
                        Принимать по: {schedule.dosage} {selected ? UNIT_TYPE_LABELS[selected.unitType] : ""}
                    </AppText>

                </View>
                {nextIntake && (
                    <View>
                        <AppText variant="subtitle">
                            Следующий приём: {formatTimeDiff(nextIntake)}
                        </AppText>
                    </View>
                )}
            </AppCard>
        </Pressable>
    )
}