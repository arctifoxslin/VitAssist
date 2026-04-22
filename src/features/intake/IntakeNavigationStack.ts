export type IntakeNavigationStack = {
    IntakeScreen: { scheduleId: string, plannedTime: number }
    TodayIntakeScreen: undefined
    HistoryScreen: undefined
    MissedIntakesScreen: { scheduleId: string }
}