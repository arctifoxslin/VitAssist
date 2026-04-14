import React from "react";
import { AppCard } from "../../../shared/ui/AppCard";
import { Schedule } from "../../../shared/types/Schedule";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { Product } from "../../../shared/types/Product";
import { AppText } from "../../../shared/ui/AppText";
import { View, Pressable } from "react-native";

interface Props {
    schedule: Schedule
    onPress?: () => void
}

export const ScheduleCard = ({ schedule, onPress }: Props) => {
    const product = useSelector((state: RootState) => {
        state.products.list.find(p => p.id === schedule.productId)
    }) as Product | undefined

    return (
        <Pressable onPress={onPress}>
            <AppCard style={{ marginBottom: 12, gap: 12 }}>
                <View>
                    <AppText variant="title">
                        {product?.name ?? 'Неизвестный препарат'}
                    </AppText>
                    <AppText variant="subtitle" color="#666">
                        {schedule.times.join(', ')}
                    </AppText>
                </View>

                <View>
                    <AppText>
                        Повторение: {schedule.repeatType}
                    </AppText>
                </View>
            </AppCard>
        </Pressable>
    )
}