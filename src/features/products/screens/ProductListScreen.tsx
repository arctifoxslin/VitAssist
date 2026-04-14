import React, { useLayoutEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { ProductCard } from "../components/ProductCard";
import { AddProductButton } from "../components/AddProductButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { AppButton } from "../../../shared/ui/AppButton"
import { useNavigation } from "@react-navigation/native";

type Navigation = NativeStackNavigationProp<ProductsNavigationStack, 'ProductsList'>

export const ProductListScreen = () => {
    const navigation = useNavigation<Navigation>()
    const products = useSelector((state: RootState) =>
        state.products.list.filter(p => !p.archived)
    )

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
                        onPress={() => { }}
                    />
                ))}
            </ScrollView>
            <AddProductButton
                onPress={() => navigation.navigate('AddProduct', {})}
            />
        </>
    )
}