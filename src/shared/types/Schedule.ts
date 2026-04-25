import { RepeatType } from "./repeatType"
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
    repeatReminderEnabled: boolean
    repeatReminderIntervalMinutes: number | null
    repeatReminderMaxCount: number | null
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
    repeatReminderEnabled: boolean
    repeatReminderIntervalMinutes: number | null
    repeatReminderMaxCount: number | null
}