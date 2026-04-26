import React, { useLayoutEffect } from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { ProductCard } from "../components/ProductCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { AppButton } from "../../../shared/ui/AppButton"
import { useNavigation } from "@react-navigation/native";
import { selectActiveProducts } from "../productsSelectors";
import { AppScreen } from "../../../shared/ui/AppScreen";
import { Fab } from "../../../shared/ui/PlusButton";

type Navigation = NativeStackNavigationProp<ProductsNavigationStack, 'ProductsList'>

export const ProductListScreen = () => {
    const navigation = useNavigation<Navigation>()
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerTitle: "Препараты"
        })
    }, [navigation])
    const products = useSelector(selectActiveProducts)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AppButton
                    title="Архив"
                    onPress={() => navigation.navigate("ArchivedProducts")}
                />
            ),
        })
    }, [navigation])

    return (
        <AppScreen>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={({ item }) => (
                    <ProductCard
                        key={item.id}
                        product={item}
                        onPress={() => navigation.navigate('AddProduct', { id: item.id })}
                    />
                )}
            />
            <Fab
                icon="plus"
                onPress={() => navigation.navigate('AddProduct', {})}
            />

        </AppScreen>
    )
}