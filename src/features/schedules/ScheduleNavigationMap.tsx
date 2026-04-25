import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "./SchedulesNavigationStack";
import { ScheduleListScreen } from "./screens/ScheduleListScreen";
import { AddScheduleScreen } from "./screens/AddScheduleScreen";

const Stack = createNativeStackNavigator<SchedulesNavigationStack>()

const SchedulesNavigationMap = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name='ScheduleList'
                component={ScheduleListScreen}
            />
            <Stack.Screen
                name='AddSchedule'
                component={AddScheduleScreen}
            />
        </Stack.Navigator>
    )
}

export default SchedulesNavigationMap