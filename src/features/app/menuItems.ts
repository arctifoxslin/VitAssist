import { AppNavigationStack } from "../../app/navigation/AppNavigationStack"

export const MENU_ITEMS: {
    label: string
    route: {
        name: keyof AppNavigationStack
        params?: any
    }
}[] = [
    {
        label: "Расписания",
        route: { name: "ScheduleNavigationMap" }
    },
    {
        label: "Препараты",
        route: { name: "ProductsNavigationMap", params: { screen: "ProductsList" } }
    },
    {
        label: "Архив препаратов",
        route: { name: "ProductsNavigationMap", params: { screen: "ArchivedProducts" } }
    },
    {
        label: "История приёмов",
        route: { name: "IntakeNavigationMap", params: { screen: "HistoryScreen" } }
    },
    {
        label: "Приёмы сегодня",
        route: { name: "IntakeNavigationMap", params: { screen: "TodayIntakeScreen" } }
    }
] as const
