import { Schedule } from "../../../shared/types/Schedule";

export function getYearsFromSchedule(schedules: Schedule[]): number[]{
    const years = new Set<number>()

    schedules.forEach(s => {
        const start = new Date(s.startDate).getFullYear()
        years.add(start)

        if(s.endDate){
            const end = new Date(s.endDate).getFullYear()
            years.add(end)
        }
    })

    const yearsRange = Array.from(years).sort((a, b) => b - a)

    return yearsRange
}