import { Schedule } from "../../../shared/types/Schedule";
import { REPEAT_TYPE } from "../../../shared/types/repeatRype";

export function getNextIntake(schedule: Schedule): number | null {
    const now = Date.now()

    const scheduleStart = new Date(schedule.startDate)
    const scheduleEnd = schedule.endDate
        ? new Date(schedule.endDate)
        : null

    const intakePeriod = scheduleEnd
        ? Math.ceil((scheduleEnd.getTime() - scheduleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 365 /*end date undefined - let limit 1 year*/

    const futureIntakes: number[] = []

    for (let i = 0; i < intakePeriod; i++) {
        const day = new Date(scheduleStart)
        day.setDate(scheduleStart.getDate() + i)

        if (schedule.repeatType === REPEAT_TYPE.everyXDays) {
            if (!schedule.everyXDays || schedule.everyXDays < 1) continue
            if (i % schedule.everyXDays !== 0) continue
        }

        if (schedule.repeatType === REPEAT_TYPE.weekly) {
            const weekDay = day.getDay()
            if (!schedule.daysOfWeek?.includes(weekDay)) continue
        }

        if (schedule.repeatType === REPEAT_TYPE.monthly) {
            if (day.getDay() !== schedule.dayOfMonth) continue
        }

        for (const intakeTime of schedule.times) {
            const [hh, mm] = intakeTime.split(":").map(Number)

            const plannedDate = new Date(day)
            plannedDate.setHours(hh)
            plannedDate.setMinutes(mm)
            plannedDate.setSeconds(0)

            const nextIntakeTime = plannedDate.getTime()
            if (nextIntakeTime > now) {
                futureIntakes.push(nextIntakeTime)
            }
        }
    }

    futureIntakes.sort((a, b) => a - b)
    return futureIntakes[0] ?? null
}