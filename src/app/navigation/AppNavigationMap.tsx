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

const getTitle = (routeName: keyof AppNavigationStack) => {
    switch(routeName) {
        case "ScheduleNavigationMap":
            return "Расписания"
        case "ProductsNavigationMap":
            return "Препараты"
        case "IntakeNavigationMap":
            return "Приёмы на сегодня"
        default:
            return ""
    }
}

const AppNavigationMap = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <NavigationContainer ref={navigationRef}>
            <View style={{ flex: 1 }}>
                <LeftSideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <Stack.Navigator 
                    screenOptions={{
                        header: ({route}) => (
                            <AppHeader
                                title={getTitle(route.name as keyof AppNavigationStack)}
                                onMenuPress={() => setMenuOpen(true)}
                            />
                        )
                    }}
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