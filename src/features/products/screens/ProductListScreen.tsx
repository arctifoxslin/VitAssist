import React, { useLayoutEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { ProductCard } from "../components/ProductCard";
import { AddProductButton } from "../components/AddProductButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { AppButton } from "../../../shared/ui/AppButton"
import { useNavigation } from "@react-navigation/native";
import { selectActiveProducts } from "../productsSelectors";

type Navigation = NativeStackNavigationProp<ProductsNavigationStack, 'ProductsList'>

export const ProductListScreen = () => {
    const navigation = useNavigation<Navigation>()
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
        <>
            <ScrollView style={{ padding: 16 }}>
                {products.map(p => (
                    <ProductCard
                        key={p.id}
                        product={p}
                        onPress={() => navigation.navigate('AddProduct', { id: p.id })}
                    />
                ))}
            </ScrollView>
            <AddProductButton
                onPress={() => navigation.navigate('AddProduct', {})}
            />
        </>
    )
}