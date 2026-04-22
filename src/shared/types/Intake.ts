export type IntakeStatus = 'taken' | 'skipped' | 'delayed'

export interface Intake {
    id: string
    productId: string
    scheduleId: string
    time: string                //time from shedule
    plannedFor: number          //timestamp of time from schedule
    actualTime: number | null   //timestamp user marked 'taken'
    status: IntakeStatus
    skipReason?: 'not_marked' | 'user_skipped' | 'expired' | null
    createdAt: number
}