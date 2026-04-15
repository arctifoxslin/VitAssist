export type RepeatType = 'once' | 'daily' | 'every_x_days' | 'weekly' | 'monthly'

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