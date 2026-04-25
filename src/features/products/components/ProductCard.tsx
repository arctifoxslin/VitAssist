import React from "react";
import { AppText } from "../../../shared/ui/AppText";
import { AppCard } from "../../../shared/ui/AppCard";
import { View, Pressable } from "react-native";
import { Product } from "../../../shared/types/Product";
import { FORM_LABELS, UNIT_TYPE_LABELS } from "../../../shared/types/units";
import { isCountableUnit } from "../../../shared/types/countableUnits";

interface Props {
    product: Product
    onPress?: () => void
}

export const ProductCard = ({ product, onPress }: Props) => {
    const unitTypeLabel = UNIT_TYPE_LABELS[product.unitType]
    const formTypeLabel = FORM_LABELS[product.form]
    return (
        <Pressable onPress={onPress}>
            <AppCard>
                <View>
                    <AppText variant="title">
                        {product.name}
                    </AppText>
                    <AppText variant="subtitle">
                        Активного вещества: {product.dosage}
                    </AppText>
                    <AppText variant="subtitle">
                        Форма препарата: {formTypeLabel}
                    </AppText>
                </View>
                {isCountableUnit(product.unitType) && (
                    <AppText variant="small">
                        {`Осталось: ${product.remainingUnits} (${unitTypeLabel})`}
                    </AppText>
                )}
            </AppCard>
        </Pressable>
    )
}