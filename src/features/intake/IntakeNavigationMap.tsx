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
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="TodayIntakeScreen"
                component={TodayIntakeScreen}
            />
            <Stack.Screen
                name="IntakeScreen"
                component={IntakeScreen}
            />
            <Stack.Screen
                name="HistoryScreen"
                component={HistoryScreen}
            />
            <Stack.Screen
                name="MissedIntakesScreen"
                component={MissedIntakesScreen}
            />
        </Stack.Navigator>
    )
}

export default IntakeNavigationMap