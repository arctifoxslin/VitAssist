/*
    Notification Repository stores all notification data
    and allows:
        cancel repeat reminders
        find notifications by scheduleId and plannedTime (for intakes)
        recover data after app refresh
*/
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StoredNotification {
    id: string
    scheduleId: string
    plannedTime: number
    isRepeatReminder: boolean
    repeatIndex: number
    isSnoozed?: boolean
}

const KEY = 'notifications'

class NotificationRepository {
    /*------Get stored torifications------*/
    async getAll(): Promise<StoredNotification[]> {
        const raw = await AsyncStorage.getItem(KEY)
        const list = raw ? JSON.parse(raw) : []
        console.log("[NotificationRepository] Loaded:", list.length, "notifications")
        return list
    }

    /*------Save notifications to store------*/
    async saveAll(list: StoredNotification[]) {
        console.log("[NotificationRepository] Saved:", list.length, "notifications")
        await AsyncStorage.setItem(KEY, JSON.stringify(list))
    }

    /*------Add new notification to store------*/
    async add(item: StoredNotification) {
        const list = await this.getAll()
        list.push(item)
        console.log("[NotificationRepository] Added:", item.id)
        await this.saveAll(list)
    }

    /*------Remove notification by id from store------*/
    async remove(id: string) {
        const list = await this.getAll()
        const filtered = list.filter(n => n.id !== id)
        console.log("[NotificationRepository] Removed:", id)
        await this.saveAll(filtered)
    }

    /*------Find notification in store by id------*/
    async findByScheduleAndTime(scheduleId: string, plannedTime: number) {
        const list = await this.getAll()
        const found = list.filter(n =>
            n.scheduleId === scheduleId && n.plannedTime === plannedTime
        )
        console.log("[NotificationRepository] Found", found.length, "notifications for schedule:", scheduleId)
        return found
    }
}

export const notificationRepository = new NotificationRepository()