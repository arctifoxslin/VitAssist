/*
    Notification Api layer for:
        planning notifications,
        cancelling notifications,
        listening onPress
*/

import notifee, { EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';

export interface NotificationPayload {
    id: string
    title: string
    body: string
    timestamp: number
    data: Record<string, string>
}

class NotificationAPI {
    /*------Permissions------*/
    async reqestPermissions() {
        try {
            await notifee.requestPermission()
            console.log('[NotificationAPI] Permissions granted')
        } catch (error) {
            console.warn('[NotificationAPI] Permission error:', error)
        }
    }

    /*------Create Channel------*/
    async createChannel() {
        await notifee.createChannel({
            id: 'reminders',
            name: 'Intake Reminders',
            importance: 4,
        })
        console.log('[NotificationAPI] Channel created: reminders')
    }

    /*------Schedule notification------*/
    async schedule(payload: NotificationPayload) {
        //DOCS: Create a time-based trigger
        console.log(
            '[NotificationAPI] Scheduling notification:',
            '\n  id:', payload.id,
            '\n  title:', payload.title,
            '\n  time:', new Date(payload.timestamp).toString(),
            '\n  data:', payload.data
        )
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: payload.timestamp
        }
        try {
            await notifee.createTriggerNotification({
                id: payload.id,
                title: payload.title,
                body: payload.body,
                android: {
                    channelId: 'reminders',
                    pressAction: { id: 'default' },
                },
                data: payload.data,
            }, trigger)
            console.log('[NotificationAPI] Scheduled successfully:', payload.id)
        } catch (error) {
            console.error('[NotificationAPI] Schedule ERROR:', error)
        }
    }

    /*------Cancel notification------*/
    async cancelSchedule(id: string) {
        console.log('[NotificationAPI] Cancelling notification:', id)
        try {
            await notifee.cancelTriggerNotification(id)
            console.log('[Notification] Cancelled: ', id)
        } catch (error) {
            console.error('[NotificationAPI] Cancel ERROR:', error)
        }
    }

    /*------Get all Notifications------*/
    async getAll() {
        const list = await notifee.getTriggerNotifications()
        console.log('[NotificationAPI] getAll():', list.length, 'notifications')
        return list
    }

    onPress(callback: (data: Record<string, any>) => void) {
        console.log('[NotificationAPI] onPress listener attached')

        notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('[NotificationAPI] Foreground PRESS:', detail.notification?.data)
                callback(detail.notification?.data ?? {})
            }
        })

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('[NotificationAPI] Background PRESS:', detail.notification?.data)
                callback(detail.notification?.data ?? {})
            }
        })
    }
}

export const notificationAPI = new NotificationAPI()