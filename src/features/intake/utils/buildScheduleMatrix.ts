import { Schedule } from "../../../shared/types/Schedule";
import { Intake, IntakeStatus } from "../../../shared/types/Intake";

export interface MatrixCell {
    day: Date
    time: string
    status?: IntakeStatus
    plannedFor: number
    scheduleId: string
    skipReason: Intake["skipReason"]
}

export interface ScheduleMatrix {
    days: Date[]
    times: string[]
    cells: MatrixCell[]
}

function getDaysRange(start: number, end?: number): Date[] {
    const startDate = new Date(start)
    const endDate = new Date(end ?? Date.now())
    const days: Date[] = []

    const current = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    )

    const last = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    )

    while (current <= last) {
        days.push(new Date(current))
        current.setDate(current.getDate() + 1)
    }

    return days
}

export function buildScheduleMatrix(
    schedule: Schedule,
    intakes: Intake[]
) {
    const days = getDaysRange(schedule.startDate, schedule.endDate)
    const times = schedule.times

    const intakeMap = new Map<string, Intake>()
    intakes.forEach(i => {
        const key = `${i.time}-${new Date(i.plannedFor).toDateString()}`
        intakeMap.set(key, i)
    })

    const cells: Record<string, Record<string, MatrixCell>> = {}

    //cells[dayKey][time] = cell
    for (const day of days) {
        const dayKey = day.toDateString()
        cells[dayKey] = {}

        for (const time of times) {
            const key = `${time}-${dayKey}`
            const intake = intakeMap.get(key)

            const plannedFor = (() => {
                const [hh, mm] = time.split(":").map(Number)
                const d = new Date(day)
                d.setHours(hh)
                d.setMinutes(mm)
                d.setSeconds(0)
                return d.getTime()
            })()

            cells[dayKey][time] = {
                day,
                time,
                status: intake?.status,
                plannedFor,
                scheduleId: schedule.id,
                skipReason: intake?.skipReason
            }
        }
    }

    return { days, times, cells }
}

export function buildAllPlannedTimes(shedule: Schedule) {
    const matrix = buildScheduleMatrix(shedule, [])
    const times: number[] = []

    for (const day of matrix.days) {
        const dayKey = day.toDateString()
        for (const time of matrix.times) {
            const cell = matrix.cells[dayKey]?.[time]
            if (cell) {
                times.push(cell.plannedFor)
            }
        }
    }

    return times
}