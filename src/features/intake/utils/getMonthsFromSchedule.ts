import { Schedule } from "../../../shared/types/Schedule";

export function getMonthsFromSchecule(
    schedules: Schedule[],
    year: number
): number[] {
    const months = new Set<number>()

    schedules.forEach(s => {
        const start = new Date(s.startDate)
        const end = s.endDate ? new Date(s.endDate) : start

        if(start.getFullYear() === year) {
            months.add(start.getMonth())
        }

        if(end.getFullYear() === year) {
            months.add(end.getMonth())
        }
    })

    const monthsRange = Array.from(months).sort((a, b) => a - b)

    return monthsRange
}