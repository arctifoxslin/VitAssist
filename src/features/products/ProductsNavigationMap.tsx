import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProductsNavigationStack } from "./ProductsNavigationStack";
import { ProductListScreen } from "./screens/ProductListScreen";
import { AddProductScreen } from "./screens/AddProductScreen";
import { ArchivedProductsScreen } from "./screens/ArchivedProductsScreen";

const Stack = createNativeStackNavigator<ProductsNavigationStack>()

const ProductsNavigationMap = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName='ProductsList'
        >
            <Stack.Screen
                name="ProductsList"
                component={ProductListScreen}
                options={{ title: 'Препараты'}}
            />
            <Stack.Screen
                name="AddProduct"
                component={AddProductScreen}
                options={{ title: 'Добавить препарат'}}
            />
            <Stack.Screen
                name="ArchivedProducts"
                component={ArchivedProductsScreen}
                options={{ title: 'Архив' }}
            />
        </Stack.Navigator>
    )
}

export default ProductsNavigationMap