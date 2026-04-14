import React from "react";
import { View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { RootState } from "../../../app/store/store";
import { unarchiveProduct } from "../productsSlice";

export const ArchivedProductsScreen = () => {
    const dispatch = useDispatch()

    const archivedProducts = useSelector((state: RootState) =>
        state.products.list.filter(p => p.archived)
    )
    const handleUnarchive = (id: string) => {
        dispatch(unarchiveProduct(id))
    }

    if (archivedProducts.length === 0) {
        return (
            <View style={{ padding: 16 }}>
                <AppText variant='body'>
                    Архив пуст
                </AppText>
            </View>
        )
    }
    return (
        <FlatList
            contentContainerStyle={{ padding: 16, gap: 16 }}
            data={archivedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: "#f2f2f2",
                    gap: 8
                }}>
                    <AppText variant='h2'>
                        {item.name}
                    </AppText>
                    {item.notes && (
                        <AppText variant='body' style={{ opacity: 0.7 }}>
                            {item.notes}
                        </AppText>
                    )}

                    <AppButton
                        title="Вернуть в список"
                        variant='primary'
                        onPress={() => handleUnarchive(item.id)}
                    />
                </View>
            )}
        />
    )
}