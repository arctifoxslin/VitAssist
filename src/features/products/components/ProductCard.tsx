import React from "react";
import { AppText } from "../../../shared/ui/AppText";
import { AppCard } from "../../../shared/ui/AppCard";
import { View, Pressable } from "react-native";
import { Product } from "../../../shared/types/Product";
import { UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { isCountableUnit } from "../../../shared/types/countableUnits";

interface Props {
    product: Product
    onPress?: () => void
}

export const ProductCard = ({ product, onPress }: Props) => {
    const unitTypeLabel = UNIT_TYPE_LABELS[product.unitType]
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
                    {isCountableUnit(product.unitType) && (
                        <AppText>
                            {`Осталось: ${product.remainingUnits} (${unitTypeLabel})`}
                        </AppText>
                    )}
                </View>
            </AppCard>
        </Pressable>
    )
}