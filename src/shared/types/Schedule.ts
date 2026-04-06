export type RepeatType = 'once' | 'daily' | 'weekly' | 'custom'

export interface Schedule {
    id: string
    productId: string
    time: string
    repeatType: RepeatType
    daysOfWeek?: number[]
    startDate: string
    endDate?: string
    createdAt: number
    updatedAt: number
}