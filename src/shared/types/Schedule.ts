import { RepeatType } from "./repeatRype"
export interface Schedule {
    id: string
    productId: string
    dosage: number
    times: string[]
    repeatType: RepeatType
    everyXDays?: number
    daysOfWeek?: number[]
    dayOfMonth?: number
    startDate: number
    endDate?: number
    createdAt: number
    updatedAt: number
}

export interface ScheduleDraft {
    productId: string
    dosage: number
    times: string[]
    repeatType: RepeatType
    everyXDays?: number
    daysOfWeek?: number[]
    dayOfMonth?: number
    startDate: number
    endDate?: number
}