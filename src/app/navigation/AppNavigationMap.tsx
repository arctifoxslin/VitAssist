import React, { useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigationStack } from "./AppNavigationStack";
import ProductsNavigationMap from "../../features/products/ProductsNavigationMap";
import SchedulesNavigationMap from "../../features/schedules/ScheduleNavigationMap";
import IntakeNavigationMap from "../../features/intake/IntakeNavigationMap";
import { LeftSideBar } from "../../features/app/LeftSideBar";
import { navigationRef } from "./NavigationRef";
import { AppHeader } from "../../shared/ui/AppHeader";

const Stack = createNativeStackNavigator<AppNavigationStack>()

const AppNavigationMap = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <NavigationContainer ref={navigationRef}>
            <View style={{ flex: 1 }}>
                <LeftSideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <Stack.Navigator
                    screenOptions={({ route, navigation }) => ({
                        header: ({ options }) => (
                            <AppHeader
                                title={options.headerTitle as string}
                                onMenuPress={() => setMenuOpen(true)}
                            />
                        )
                    })}
                >
                    <Stack.Screen
                        name="ScheduleNavigationMap"
                        component={SchedulesNavigationMap}
                    />
                    <Stack.Screen
                        name="ProductsNavigationMap"
                        component={ProductsNavigationMap}
                    />
                    <Stack.Screen
                        name="IntakeNavigationMap"
                        component={IntakeNavigationMap}
                    />
                </Stack.Navigator>

            </View>
        </NavigationContainer>
    )
}

export default AppNavigationMap