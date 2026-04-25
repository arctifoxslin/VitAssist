import React from "react";
import { AppCard } from "../../../shared/ui/AppCard";
import { Schedule } from "../../../shared/types/Schedule";
import { useSelector } from "react-redux";
import { selectActiveProducts } from "../../products/productsSelectors";
import { AppText } from "../../../shared/ui/AppText";
import { View, Pressable } from "react-native";
import { UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { formatTimeDiff } from "../../intake/utils/formatTimeDiff";
import { getNextIntake } from "../../../shared/utils/generatePlannedIntakes";
import { COLORS } from "../../../shared/ui/theme/colors";

interface Props {
    schedule: Schedule
    onPress?: () => void
    now?: number
}

export const ScheduleCard = ({ schedule, now, onPress }: Props) => {
    const products = useSelector(selectActiveProducts)
    const selected = products.find(p => p.id === schedule.productId)
    const nextIntakeTs = getNextIntake(schedule)

    return (
        <Pressable onPress={onPress}>
            <AppCard>
                <View>
                    <AppText variant="title">
                        {selected?.name ?? 'Неизвестный препарат'}
                    </AppText>
                    <AppText variant="subtitle" color={COLORS.textSecondary}>
                        {schedule.times.join(', ')}
                    </AppText>
                    <AppText variant="subtitle">
                        Принимать по: {schedule.dosage} {selected ? UNIT_TYPE_LABELS[selected.unitType] : ""}
                    </AppText>

                </View>
                {nextIntakeTs && (
                    <View>
                        <AppText variant="subtitle">
                            Следующий приём: {formatTimeDiff(nextIntakeTs, now)}
                        </AppText>
                    </View>
                )}
            </AppCard>
        </Pressable>
    )
}