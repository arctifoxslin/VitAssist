export type IntakeStatus = 'taken' | 'skipped' | 'missed'

export interface Intale {
    id: string
    productId: string
    scheduleId: string
    date: string
    time: string
    status: IntakeStatus
    createdAt: number
}