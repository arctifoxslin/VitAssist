export type NotificationType = 'intake_reminder' | 'low_stock' | 'refill_reminder'

export interface NotificationData {
    type: NotificationType
    scheduleId?: string
    time?: string
    productId?: string
}