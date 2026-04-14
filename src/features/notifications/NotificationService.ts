import notifee, { EventType, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { Schedule } from '../../shared/types/Schedule';
import { NotificationData } from './types';
import { generateNotificationId } from './id';

class NotificationServices {
    /*------Permissions------*/
    async reqestPermissions() {
        try{
            await notifee.requestPermission()
            console.log('[Notification] Permissions granted')
        } catch(error) {
            console.warn('[Notification] Permission error:', error)
        }
    }

    /*------Create Channel------*/
    async createChannel() {
        await notifee.createChannel({
            id: 'reminders',
            name: 'Intake Reminders',
            importance: 4,
        })
        console.log('[Notification] Channels granted')
    }

    /*------Schedule notification------*/
    async scheduleNotification(schedule: Schedule){
        for(const time of schedule.times){
            const [hh, mm] = time.split(':').map(Number)

            const date = new Date()
            date.setHours(hh)
            date.setMinutes(mm)
            date.setSeconds(0)

            if(date.getTime() < Date.now()) {
                date.setDate(date.getDate() + 1)
            }

            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: date.getTime(),
                repeatFrequency: RepeatFrequency.DAILY
            }

            const id = generateNotificationId(
                'intake_reminder',
                schedule.id,
                time,
            )

            const data: NotificationData = {
                type: 'intake_reminder',
                scheduleId: schedule.id,
                time,
            }

            await notifee.createTriggerNotification({
                id,
                title: 'Время приёма',
                body: 'Пора принять препарат',
                android: {
                    channelId: 'reminders',
                    pressAction: {id: 'default'}
                },
                data: data as unknown as Record<string, any>,
            }, trigger)

            console.log('[Notification] Scheduled: ', id)
        }
    }
    /*------Cancel notification------*/
    async cancelScheduleNotifications(scheduleId: string) {
        const notifications = await notifee.getTriggerNotifications()

        const idsToCancel = notifications
        .filter(n => String(n.notification?.id).includes(scheduleId))
        .map(n => String(n.notification!.id))
        
        for(const id of idsToCancel) {
            await notifee.cancelTriggerNotification(id)
            console.log('[Notification] Cancelled: ', id)
        }
    }

    /*------Update Notification------*/
    async updateScheduleNotifications(schedule: Schedule) {
        await this.cancelScheduleNotifications(schedule.id)
        await this.scheduleNotification(schedule)
    }

    /*------User onPress Notification------*/
    onPressNotification(callback: (data: NotificationData) => void) {
        notifee.onForegroundEvent(({type, detail}) => {
            if(type === EventType.PRESS) {
                const raw = detail.notification?.data
                if(!raw || typeof raw !== 'object') {
                    return
                }
                const data = raw as unknown as NotificationData
                if(data) {
                    callback(data)
                }
            }
        })

        notifee.onBackgroundEvent(async ({type, detail}) => {
            if(type === EventType.PRESS){
                const raw = detail.notification?.data
                if(!raw || typeof raw !== 'object') {
                    return
                }
                const data = raw as unknown as NotificationData
                if(data) {
                    callback(data)
                }
            }
        })
    }
}

export const notificationService = new NotificationServices()