import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigationStack } from "./AppNavigationStack";
import ProductsNavigationMap from "../../features/products/ProductsNavigationMap";
import SchedulesNavigationMap from "../../features/schedules/ScheduleNavigationMap";

const Stack = createNativeStackNavigator<AppNavigationStack>()

const AppNavigationMap = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="ScheduleNavigationMap"
                    component={SchedulesNavigationMap}
                />
                <Stack.Screen
                    name="ProductsNavigationMap"
                    component={ProductsNavigationMap}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigationMap