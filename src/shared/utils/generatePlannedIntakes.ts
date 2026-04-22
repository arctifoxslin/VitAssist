import { Schedule } from "../types/Schedule";
import { REPEAT_TYPE } from "../types/repeatRype";

function generatePlannedIntakes(schedule: Schedule): number[] {
    const scheduleStart = new Date(schedule.startDate)
    const scheduleEnd = schedule.endDate
        ? new Date(schedule.endDate)
        : new Date(scheduleStart.getTime() + 365 * (1000 * 60 * 60 * 24))

    const intakePeriod =
        Math.ceil((scheduleEnd.getTime() - scheduleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const result: number[] = []

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
            plannedDate.setMilliseconds(0)

            result.push(plannedDate.getTime())
        }
    }
    return result
}

export function getNextIntake(schedule: Schedule) {
    const now = Date.now()
    return generatePlannedIntakes(schedule).filter(t => t > now)[0] ?? null
}

export function getPastIntakes(schedule: Schedule) {
    const now = Date.now()
    return generatePlannedIntakes(schedule).filter(t => t < now)
}

export function getNextIntakeTimeAfter(schedule: Schedule, fromTime: number | null) {
    if (!fromTime) return null
    return generatePlannedIntakes(schedule).find(t => t > fromTime) ?? null
}