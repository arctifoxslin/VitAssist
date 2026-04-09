import React from "react";
import { Card, Text } from "react-native-paper";
import { Product } from "../../../shared/types/Product";

interface Props {
    product: Product
    onPress?: () => void
}

export const ProductCard = ({ product, onPress }: Props) => {
    return (
        <Card onPress={onPress} style={{ marginBottom: 12 }}>
            <Card.Title title={product.name} subtitle={product.dosage} />
            <Card.Content>
                {product.remainingUnits !== undefined && (
                    <Text>Осталось: {product.remainingUnits} {product.unitType}</Text>
                )}
            </Card.Content>
        </Card>
    )
}