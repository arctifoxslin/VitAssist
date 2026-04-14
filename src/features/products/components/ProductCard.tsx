import React from "react";
import { AppText } from "../../../shared/ui/AppText";
import { AppCard } from "../../../shared/ui/AppCard";
import { View, Pressable } from "react-native";
import { Product } from "../../../shared/types/Product";

interface Props {
    product: Product
    onPress?: () => void
}

export const ProductCard = ({ product, onPress }: Props) => {
    return (
        <Pressable onPress={onPress}>
            <AppCard style={{ marginBottom: 12, gap: 12 }}>
                <View>
                    <AppText variant="title">
                        {product.name}
                    </AppText>
                    <AppText variant="subtitle" color="#666">
                        {product.dosage}
                    </AppText>
                </View>
                <View>
                    {product.remainingUnits !== undefined && (
                        <AppText>
                            Осталось: {product.remainingUnits} {product.unitType}
                        </AppText>
                    )}
                </View>
            </AppCard>
        </Pressable>
    )
}