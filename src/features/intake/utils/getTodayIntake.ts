import { Schedule } from "../../../shared/types/Schedule"
export interface TodayIntake {
    scheduleId: string
    productId: string
    time: string
    plannedFor: number
}

export function getTodayIntake(schedules: Schedule[]): TodayIntake[] {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return schedules.flatMap(schedule => {
        return schedule.times.map(time => {
            const [hh, mm] = time.split(":").map(Number)

            const plannedDate = new Date(today)
            plannedDate.setHours(hh)
            plannedDate.setMinutes(mm)
            plannedDate.setSeconds(0)

            return {
                scheduleId: schedule.id,
                productId: schedule.productId,
                time,
                plannedFor: plannedDate.getTime(),
            }
        })
    })
}