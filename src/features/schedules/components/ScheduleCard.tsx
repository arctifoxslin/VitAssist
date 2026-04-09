import React from "react";
import { Card, Text } from "react-native-paper";
import { Schedule } from "../../../shared/types/Schedule";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { Product } from "../../../shared/types/Product";

interface Props {
    schedule: Schedule
    onPress?: () => void
}

export const ScheduleCard = ({ schedule, onPress }: Props) => {
    const product = useSelector((state: RootState) => {
        state.products.list.find(p => p.id === schedule.productId)
    }) as Product | undefined

    return (
        <Card
            onPress={onPress}
            style={{ marginBottom: 12 }}
        >
            <Card.Title
                title={product?.name ?? 'Неизвестный препарат'}
                subtitle={schedule.times.join(', ')}
            />
            <Card.Content>
                <Text>
                    Повторение: {schedule.repeatType}
                </Text>
            </Card.Content>
        </Card>
    )
}