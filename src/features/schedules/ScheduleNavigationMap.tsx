import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SchedulesNavigationStack } from "./SchedulesNavigationStack";
import { ScheduleListScreen } from "./screens/ScheduleListScreen";
import { AddScheduleScreen } from "./screens/AddScheduleScreen";

const Stack = createNativeStackNavigator<SchedulesNavigationStack>()

const SchedulesNavigationMap = () => {
    return(
        <Stack.Navigator initialRouteName='ScheduleList'>
            <Stack.Screen
                name='ScheduleList'
                component={ScheduleListScreen}
                options={{ title: 'Расписание' }}
            />
            <Stack.Screen
                name='AddSchedule'
                component={AddScheduleScreen}
                options={{ title: 'Новое расписание' }}
            />
        </Stack.Navigator>
    )
}

export default SchedulesNavigationMap