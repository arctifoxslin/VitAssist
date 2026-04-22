export type NotificationType = 'intake_reminder' | 'low_stock' | 'refill_reminder'

export interface NotificationData {
    type: NotificationType

    scheduleId?: string
    plannedTime?: string
    repeatIndex?: string
    isRepeatReminder?: string
    isSnoozed?: string

    time?: string
    productId?: string

}