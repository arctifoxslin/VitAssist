import React, { useLayoutEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { ProductCard } from "../components/ProductCard";
import { AddProductButton } from "../components/AddProductButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "../ProductsNavigationStack";
import { Button } from "react-native-paper";

type Props = NativeStackScreenProps<ProductsNavigationStack, 'ProductsList'>

export const ProductListScreen = ({ navigation }: Props) => {
    const products = useSelector((state: RootState) => 
        state.products.list.filter(p => !p.archived)
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => navigation.navigate("ArchivedProducts")}>
                    Архива
                </Button>
            ),
        })
    }, [navigation])

    return (
        <>
            <ScrollView style={{ padding: 16 }}>
                {products.map(p => (
                    <ProductCard
                        key = {p.id}
                        product={p}
                        onPress={() => {}}
                    />
                ))}
            </ScrollView>
            <AddProductButton
                onPress={() => navigation.navigate('AddProduct', {})}
            />
        </>
    )
}