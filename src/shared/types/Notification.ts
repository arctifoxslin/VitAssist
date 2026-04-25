export type NotificationType =
    | 'primary'
    | 'repeat'
    | 'snooze'

export interface BaseNotificationData {
    type: NotificationType
}

export interface IntakeNotificationData extends BaseNotificationData {
    type: 'primary' | 'repeat' | 'snooze'
    scheduleId: string
    plannedTime: string
    repeatIndex: string
    isSnoozed?: string
    isRepeatReminder?: string
}

export type NotificationData =
    IntakeNotificationData
/*NotificationData type will be updated with new interfaces in future
TS identify which interface is used by type defenition  */