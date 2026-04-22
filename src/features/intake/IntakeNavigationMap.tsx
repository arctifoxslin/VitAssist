import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IntakeNavigationStack } from "./IntakeNavigationStack";
import { IntakeScreen } from "./screens/IntakeScreen";
import { TodayIntakeScreen } from "./screens/TodayIntakeScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { MissedIntakesScreen } from "./screens/MissedIntakesScreen";

const Stack = createNativeStackNavigator<IntakeNavigationStack>()

const IntakeNavigationMap = () => {
    return (
        <Stack.Navigator
            initialRouteName='TodayIntakeScreen'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="TodayIntakeScreen"
                component={TodayIntakeScreen}
                options={{ title: "Приёмы на сегодня" }}
            />
            <Stack.Screen
                name="IntakeScreen"
                component={IntakeScreen}
                options={{ title: "Отметить приём" }}
            />
            <Stack.Screen
                name="HistoryScreen"
                component={HistoryScreen}
                options={{ title: "История приёмов" }}
            />
            <Stack.Screen
                name="MissedIntakesScreen"
                component={MissedIntakesScreen}
                options={{ title: "Пропущенные приёмы" }}
            />
        </Stack.Navigator>
    )
}

export default IntakeNavigationMap