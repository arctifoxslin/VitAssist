import React, { useLayoutEffect } from "react";
import { View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppText } from "../../../shared/ui/AppText";
import { AppButton } from "../../../shared/ui/AppButton";
import { unarchiveProduct } from "../productsSlice";
import { selectArchivedProducts } from "../productsSelectors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { useNavigation } from "@react-navigation/native";
import { AppScreen } from "../../../shared/ui/AppScreen";
import { AppCard } from "../../../shared/ui/AppCard";

type Navigation = NativeStackNavigationProp<ProductsNavigationStack, 'ProductsList'>

export const ArchivedProductsScreen = () => {
    const navigation = useNavigation<Navigation>()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Архив препаратов"
        })
    }, [navigation])
    const dispatch = useDispatch()

    const archivedProducts = useSelector(selectArchivedProducts)
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
        <AppScreen>
            <FlatList
                data={archivedProducts}
                contentContainerStyle={{ padding: 16, gap: 16 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AppCard row={true}>
                        <View>
                            <AppText variant="h3">
                                {item.name}
                            </AppText>
                            {item.notes && (
                                <AppText variant='body' style={{ opacity: 0.7 }}>
                                    {item.notes}
                                </AppText>
                            )}
                        </View>
                        <AppButton
                            title="Вернуть в список"
                            variant='primary'
                            onPress={() => handleUnarchive(item.id)}
                        />
                    </AppCard>

                )}
            />
        </AppScreen>
    )
}