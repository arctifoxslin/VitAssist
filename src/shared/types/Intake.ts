export type IntakeStatus = 'taken' | 'skipped' | 'delayed'

export interface Intake {
    id: string
    productId: string
    scheduleId: string
    time: string
    plannedFor: number
    status: IntakeStatus
    createdAt: number
}